import { $Values } from 'utility-types';
import { Channel } from 'redux-saga';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import {
  getExtensionHash,
  Extension,
  ClientType,
  ROOT_DOMAIN_ID,
  ColonyClient,
  ColonyRole,
  TokenClientType,
} from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import { poll } from 'ethers/utils';
import { createAddress } from '~utils/web3';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  getLoggedInUser,
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
  SubscribeToColonyMutation,
  SubscribeToColonyMutationVariables,
  SubscribeToColonyDocument,
  NetworkExtensionVersionQuery,
  NetworkExtensionVersionQueryVariables,
  NetworkExtensionVersionDocument,
  cacheUpdates,
} from '~data/index';
import { ActionTypes, Action, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { TxConfig } from '~types/index';

import {
  transactionAddParams,
  transactionReady,
  transactionPending,
} from '../../core/actionCreators';
import { createTransaction, createTransactionChannels } from '../../core/sagas';

interface ChannelDefinition {
  channel: Channel<any>;
  index: number;
  id: string;
}

function* colonyRestartDeployment({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.DEPLOYMENT_RESTART>) {
  try {
    const { walletAddress, username } = yield getLoggedInUser();
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const { networkClient } = colonyManager;

    let startingIndex = 7;
    const channelNames: string[] = [];

    /*
     * Validate the required values
     */
    if (!username) {
      throw new Error(
        `The user does not have a profile associated, hence cannot run the Colony Restart Deployment flow`,
      );
    }
    if (!colonyAddress) {
      throw new Error(
        `The colony adress was not provided to the Colony Restart Deployment flow`,
      );
    }

    const colonyClient: ColonyClient = yield networkClient.getColonyClient(
      colonyAddress,
    );
    const { tokenClient } = colonyClient;
    const tokenOwnerAddress = yield tokenClient.owner();

    /*
     * Check if the user **actually** has permissions to restart the colony
     * deployment flow, on the colony home we just do a superficial check
     *
     * Note that this accounts for user intreacting with the contracts in the
     * time between creation and re-starting the deployment flow, hence we
     * need to be more granular in our permissions checks
     */
    const hasRootRole = yield colonyClient.hasUserRole(
      walletAddress,
      ROOT_DOMAIN_ID,
      ColonyRole.Root,
    );
    const hasAdministrationRole = yield colonyClient.hasUserRole(
      walletAddress,
      ROOT_DOMAIN_ID,
      ColonyRole.Administration,
    );
    const hasRecoveryRole = yield colonyClient.hasUserRole(
      walletAddress,
      ROOT_DOMAIN_ID,
      ColonyRole.Recovery,
    );
    const isTokenOwner = tokenOwnerAddress === walletAddress;

    if (
      !hasRootRole ||
      !hasAdministrationRole ||
      !hasRecoveryRole ||
      !isTokenOwner
    ) {
      throw new Error(
        `User does not have the required permissions to run the Colony Restart Deployment flow`,
      );
    }

    /*
     * Check if the token authority is set up
     */
    if (tokenClient.tokenClientType === TokenClientType.Colony) {
      const tokenAuthority = yield tokenClient.authority();
      if (tokenAuthority === AddressZero) {
        startingIndex -= 2;
        channelNames.push('deployTokenAuthority');
        channelNames.push('setTokenAuthority');
        channelNames.push('setOwner');
      }
    }

    /*
     * This is an optional step, but since we run through this flow, we can also
     * manually start it, to provide the user with a better overall colony experience
     */

    const oneTxExtensionAddress = yield networkClient.getExtensionInstallation(
      getExtensionHash(Extension.OneTxPayment),
      colonyAddress,
    );

    /*
     * The OneTxPayment extension is not set up, we add it to the flow
     */
    if (oneTxExtensionAddress === AddressZero) {
      startingIndex -= 3;
      channelNames.push('deployOneTx');
      channelNames.push('setOneTxRoleAdministration');
      channelNames.push('setOneTxRoleFunding');
    } else {
      /*
       * OneTxPayment **is** set up, so we just need to check if we can, and need
       * to set its roles
       */
      if (
        yield colonyClient.hasUserRole(
          oneTxExtensionAddress,
          ROOT_DOMAIN_ID,
          ColonyRole.Administration,
        )
      ) {
        startingIndex -= 1;
        channelNames.push('setOneTxRoleAdministration');
      }
      if (
        yield colonyClient.hasUserRole(
          oneTxExtensionAddress,
          ROOT_DOMAIN_ID,
          ColonyRole.Funding,
        )
      ) {
        startingIndex -= 1;
        channelNames.push('setOneTxRoleFunding');
      }
    }

    const channels: {
      [id: string]: ChannelDefinition;
    } = yield call(
      createTransactionChannels,
      meta.id,
      channelNames,
      startingIndex,
    );

    const {
      deployTokenAuthority,
      setTokenAuthority,
      deployOneTx,
      setOneTxRoleAdministration,
      setOneTxRoleFunding,
      setOwner,
    } = channels;

    const createGroupedTransaction = (
      { id, index }: $Values<typeof channels>,
      config: TxConfig,
    ) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: 'restartColonyDeployment',
          id: meta.id,
          index,
        },
      });

    if (deployTokenAuthority) {
      yield createGroupedTransaction(deployTokenAuthority, {
        context: ClientType.ColonyClient,
        methodName: 'deployTokenAuthority',
        identifier: colonyAddress,
        ready: false,
      });
      yield createGroupedTransaction(setTokenAuthority, {
        context: ClientType.TokenClient,
        methodName: 'setAuthority',
        identifier: tokenClient.address,
        ready: false,
      });
      yield createGroupedTransaction(setOwner, {
        context: ClientType.TokenClient,
        methodName: 'setOwner',
        identifier: tokenClient.address,
        ready: false,
      });
    }

    if (deployOneTx) {
      yield createGroupedTransaction(deployOneTx, {
        context: ClientType.ColonyClient,
        methodName: 'installExtension',
        identifier: colonyAddress,
        ready: false,
      });
    }

    if (setOneTxRoleAdministration) {
      yield createGroupedTransaction(setOneTxRoleAdministration, {
        context: ClientType.ColonyClient,
        methodContext: 'setOneTxRoles',
        methodName: 'setAdministrationRoleWithProofs',
        identifier: colonyAddress,
        ready: false,
      });
    }

    if (setOneTxRoleFunding) {
      yield createGroupedTransaction(setOneTxRoleFunding, {
        context: ClientType.ColonyClient,
        methodContext: 'setOneTxRoles',
        methodName: 'setFundingRoleWithProofs',
        identifier: colonyAddress,
        ready: false,
      });
    }

    /*
     * Wait until all transactions are created.
     */
    yield all(
      Object.keys(channels).map((id) =>
        takeFrom(channels[id].channel, ActionTypes.TRANSACTION_CREATED),
      ),
    );

    if (deployTokenAuthority) {
      /*
       * Deploy Token Authority
       */
      const tokenLockingAddress = yield networkClient.getTokenLocking();
      yield put(
        transactionAddParams(deployTokenAuthority.id, [
          tokenClient.address,
          [tokenLockingAddress],
        ]),
      );
      yield put(transactionReady(deployTokenAuthority.id));
      const {
        payload: { deployedContractAddress, eventData },
      } = yield takeFrom(
        deployTokenAuthority.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );

      /*
       * Set Token authority (to deployed Token Authority)
       */
      yield put(
        transactionAddParams(setTokenAuthority.id, [
          createAddress(
            eventData?.TokenAuthorityDeployed?.tokenAuthorityAddress ||
              deployedContractAddress,
          ),
        ]),
      );
      yield put(transactionReady(setTokenAuthority.id));
      yield takeFrom(
        setTokenAuthority.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );

      /*
       * Set the Token's owner
       */
      yield put(transactionAddParams(setOwner.id, [colonyAddress]));
      yield put(transactionReady(setOwner.id));
      yield takeFrom(setOwner.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    }

    /*
     * Deploy OneTx
     */
    if (deployOneTx) {
      const {
        data: { networkExtensionVersion },
      } = yield apolloClient.query<
        NetworkExtensionVersionQuery,
        NetworkExtensionVersionQueryVariables
      >({
        query: NetworkExtensionVersionDocument,
        variables: {
          extensionId: Extension.OneTxPayment,
        },
        fetchPolicy: 'network-only',
      });
      const [latestOneTxDepoyment] = networkExtensionVersion;

      yield put(
        transactionAddParams(deployOneTx.id, [
          getExtensionHash(Extension.OneTxPayment),
          latestOneTxDepoyment?.version || 0,
        ]),
      );
      yield put(transactionReady(deployOneTx.id));

      yield takeFrom(deployOneTx.channel, ActionTypes.TRANSACTION_SUCCEEDED);

      /*
       * Set OneTx administration role
       */
      yield put(transactionPending(setOneTxRoleAdministration.id));

      const oneTxPaymentExtension = yield poll(
        async () => {
          try {
            const client = await colonyManager.getClient(
              ClientType.OneTxPaymentClient,
              colonyAddress,
            );
            return client;
          } catch (err) {
            return undefined;
          }
        },
        {
          timeout: 30000,
        },
      );

      const extensionAddress = oneTxPaymentExtension.address;

      yield put(
        transactionAddParams(setOneTxRoleAdministration.id, [
          extensionAddress,
          ROOT_DOMAIN_ID,
          true,
        ]),
      );
      yield put(transactionReady(setOneTxRoleAdministration.id));
      yield takeFrom(
        setOneTxRoleAdministration.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );

      /*
       * Set OneTx funding role
       */
      yield put(
        transactionAddParams(setOneTxRoleFunding.id, [
          extensionAddress,
          ROOT_DOMAIN_ID,
          true,
        ]),
      );
      yield put(transactionReady(setOneTxRoleFunding.id));

      yield colonyManager.setColonyClient(colonyAddress);

      yield takeFrom(
        setOneTxRoleFunding.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    yield apolloClient.query<
      ProcessedColonyQuery,
      ProcessedColonyQueryVariables
    >({
      query: ProcessedColonyDocument,
      variables: {
        address: colonyAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield apolloClient.mutate<
      SubscribeToColonyMutation,
      SubscribeToColonyMutationVariables
    >({
      mutation: SubscribeToColonyDocument,
      variables: {
        input: { colonyAddress },
      },
      update: cacheUpdates.subscribeToColony(colonyAddress),
    });

    yield put<AllActions>({
      type: ActionTypes.DEPLOYMENT_RESTART_SUCCESS,
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.DEPLOYMENT_RESTART_ERROR, error, meta);
    console.error('saga err', error);
  }
}

export default function* colonyFinishDeploymentSaga() {
  yield takeLatest(ActionTypes.DEPLOYMENT_RESTART, colonyRestartDeployment);
}
