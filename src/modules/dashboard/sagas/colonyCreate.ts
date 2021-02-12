import { $Values } from 'utility-types';
import { Channel } from 'redux-saga';
import { all, call, fork, put } from 'redux-saga/effects';
import {
  getExtensionHash,
  Extension,
  ClientType,
  ROOT_DOMAIN_ID,
  ColonyVersion,
} from '@colony/colony-js';
import { poll } from 'ethers/utils';

import { ContextModule, TEMP_getContext } from '~context/index';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import {
  getLoggedInUser,
  refetchUserNotifications,
  CreateUserMutation,
  CreateUserDocument,
  CreateUserMutationVariables,
  SubscribeToColonyDocument,
  SubscribeToColonyMutation,
  SubscribeToColonyMutationVariables,
  cacheUpdates,
} from '~data/index';
import ENS from '~lib/ENS';
import { ActionTypes, Action, AllActions } from '~redux/index';
import { createAddress } from '~utils/web3';
import { putError, takeFrom, takeLatestCancellable } from '~utils/saga/effects';
import { TxConfig } from '~types/index';

import {
  transactionAddParams,
  transactionAddIdentifier,
  transactionReady,
  transactionLoadRelated,
  transactionPending,
} from '../../core/actionCreators';
import { createTransaction, createTransactionChannels } from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';

interface ChannelDefinition {
  channel: Channel<any>;
  index: number;
  id: string;
}

function* colonyCreate({
  meta,
  payload: {
    colonyName: givenColonyName,
    displayName,
    tokenAddress: givenTokenAddress,
    tokenChoice,
    tokenName: givenTokenName,
    tokenSymbol: givenTokenSymbol,
    username: givenUsername,
  },
}: Action<ActionTypes.COLONY_CREATE>) {
  const { username: currentUsername, walletAddress } = yield getLoggedInUser();
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
  const { networkClient } = colonyManager;

  const channelNames: string[] = [];

  /*
   * If the user did not claim a profile yet, define a tx to create the user.
   */
  if (!currentUsername) {
    channelNames.push('createUser');
  }
  /*
   * If the user opted to create a token, define a tx to create the token.
   */
  if (tokenChoice === 'create') {
    channelNames.push('createToken');
  }
  channelNames.push('createColony');
  /*
   * If the user opted to create a token,  define txs to manage the token.
   */
  if (tokenChoice === 'create') {
    channelNames.push('deployTokenAuthority');
    channelNames.push('setTokenAuthority');
    channelNames.push('setOwner');
  }

  channelNames.push('deployOneTx');
  channelNames.push('setOneTxRoleAdministration');
  channelNames.push('setOneTxRoleFunding');

  /*
   * Define a manifest of transaction ids and their respective channels.
   */
  const channels: {
    [id: string]: ChannelDefinition;
  } = yield call(createTransactionChannels, meta.id, channelNames);
  const {
    createColony,
    createToken,
    createUser,
    deployOneTx,
    setOneTxRoleAdministration,
    setOneTxRoleFunding,
    deployTokenAuthority,
    setTokenAuthority,
    setOwner,
  } = channels;

  const createGroupedTransaction = (
    { id, index }: $Values<typeof channels>,
    config: TxConfig,
  ) =>
    fork(createTransaction, id, {
      ...config,
      group: {
        key: 'createColony',
        id: meta.id,
        index,
      },
    });

  /*
   * Create all transactions for the group.
   */
  try {
    const colonyName = ENS.normalize(givenColonyName);
    const username = ENS.normalize(givenUsername);

    const tokenName = givenTokenName;
    const tokenSymbol = givenTokenSymbol;

    if (createUser) {
      yield createGroupedTransaction(createUser, {
        context: ClientType.NetworkClient,
        methodName: 'registerUserLabel',
        params: [username, ''],
        ready: true,
      });
    }

    if (createToken) {
      yield createGroupedTransaction(createToken, {
        context: ClientType.NetworkClient,
        methodName: 'deployToken',
        params: [tokenName, tokenSymbol, DEFAULT_TOKEN_DECIMALS],
      });
    }

    if (createColony) {
      yield createGroupedTransaction(createColony, {
        context: ClientType.NetworkClient,
        methodName: 'createColony(address,uint256,string,string)',
        ready: false,
      });
    }

    if (deployTokenAuthority) {
      yield createGroupedTransaction(deployTokenAuthority, {
        context: ClientType.ColonyClient,
        methodName: 'deployTokenAuthority',
        ready: false,
      });
    }

    if (setTokenAuthority) {
      yield createGroupedTransaction(setTokenAuthority, {
        context: ClientType.TokenClient,
        methodName: 'setAuthority',
        ready: false,
      });
    }


    if (setOwner) {
      yield createGroupedTransaction(setOwner, {
        context: ClientType.TokenClient,
        methodName: 'setOwner',
        ready: false,
      });
    }

    if (deployOneTx) {
      yield createGroupedTransaction(deployOneTx, {
        context: ClientType.ColonyClient,
        methodName: 'installExtension',
        ready: false,
      });
    }

    if (setOneTxRoleAdministration) {
      yield createGroupedTransaction(setOneTxRoleAdministration, {
        context: ClientType.ColonyClient,
        methodContext: 'setOneTxRoles',
        methodName: 'setAdministrationRoleWithProofs',
        ready: false,
      });
    }

    if (setOneTxRoleFunding) {
      yield createGroupedTransaction(setOneTxRoleFunding, {
        context: ClientType.ColonyClient,
        methodContext: 'setOneTxRoles',
        methodName: 'setFundingRoleWithProofs',
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

    /*
     * Dispatch a success action; this progresses to next wizard step,
     * where transactions can get processed.
     */
    yield put<AllActions>({
      type: ActionTypes.COLONY_CREATE_SUCCESS,
      meta,
      payload: undefined,
    });

    if (createUser) {
      /*
       * If the username is being created, wait for the transaction to succeed
       * before creating the profile store and dispatching a success action.
       */
      yield takeFrom(createUser.channel, ActionTypes.TRANSACTION_SUCCEEDED);
      yield put<AllActions>(transactionLoadRelated(createUser.id, true));

      yield apolloClient.mutate<
        CreateUserMutation,
        CreateUserMutationVariables
      >({
        mutation: CreateUserDocument,
        variables: {
          createUserInput: { username },
          loggedInUserInput: { username },
        },
      });

      yield put<AllActions>(transactionLoadRelated(createUser.id, false));

      yield refetchUserNotifications(walletAddress);
    }

    /*
     * For transactions that rely on the receipt/event data of previous transactions,
     * wait for these transactions to succeed, collect the data, and apply it to
     * the pending transactions.
     */
    let tokenAddress: string;
    if (createToken) {
      const {
        payload: { deployedContractAddress },
      } = yield takeFrom(
        createToken.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
      tokenAddress = createAddress(deployedContractAddress);
    } else {
      if (!givenTokenAddress) {
        throw new Error('Token address not provided');
      }
      tokenAddress = createAddress(givenTokenAddress);
    }

    /**
     * If we're not recovering this will be overwritten
     */
    let colonyAddress;
    if (createColony) {
      const colonyMetadataIpfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          colonyName,
          colonyDisplayName: displayName,
          colonyAvatarHash: null,
          colonyTokens: [],
        }),
      );

      yield put(
        transactionAddParams(createColony.id, [
          tokenAddress,
          ColonyVersion.CeruleanLightweightSpaceship,
          colonyName,
          colonyMetadataIpfsHash,
        ]),
      );
      yield put(transactionReady(createColony.id));

      const {
        payload: {
          eventData: {
            ColonyAdded: { colonyAddress: createdColonyAddress },
          },
        },
      } = yield takeFrom(
        createColony.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
      colonyAddress = createdColonyAddress;
      if (!colonyAddress) {
        return yield putError(
          ActionTypes.COLONY_CREATE_ERROR,
          new Error('Missing colony address'),
          meta,
        );
      }

      yield put(transactionLoadRelated(createColony.id, true));
    } 

    if (createColony) {
      yield put(transactionLoadRelated(createColony.id, false));
    }
    /*
     * Add a colonyAddress identifier to all pending transactions.
     */
    yield all(
      [
        deployTokenAuthority,
        setTokenAuthority,
        setOwner,
        deployOneTx,
        setOneTxRoleAdministration,
        setOneTxRoleFunding,
      ]
        .filter(Boolean)
        .map(({ id }) => put(transactionAddIdentifier(id, colonyAddress))),
    );

    if (deployTokenAuthority) {
      /*
       * Deploy TokenAuthority
       */
      const tokenLockingAddress = yield networkClient.getTokenLocking();
      yield put(
        transactionAddParams(deployTokenAuthority.id, [
          tokenAddress,
          [tokenLockingAddress],
        ]),
      );
      yield put(transactionReady(deployTokenAuthority.id));
      const {
        payload: { deployedContractAddress },
      } = yield takeFrom(
        deployTokenAuthority.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );

      /*
       * Set Token authority (to deployed TokenAuthority)
       */
      yield put(
        transactionAddParams(setTokenAuthority.id, [deployedContractAddress]),
      );
      yield put(transactionReady(setTokenAuthority.id));
      yield takeFrom(
        setTokenAuthority.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }


    if (setOwner) {
      yield put(
        transactionAddParams(setOwner.id, [
          colonyAddress,
        ]),
      );
      yield put(transactionReady(setOwner.id));
      yield takeFrom(
        setOwner.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    if (deployOneTx) {
      /*
       * Deploy OneTx
       */
      yield put(
        transactionAddParams(deployOneTx.id, [
          getExtensionHash(Extension.OneTxPayment),
          1,
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

    /*
     * Manually subscribe the user to the colony
     *
     * @NOTE That this just subscribes the user to a particular address, as we
     * don't have the capability any more, to check if that address is a valid
     * colony, on the server side
     *
     * However, we do know that his colony actually exists, since we just
     * created it, but be **WARNED** that his is race condition!!
     *
     * We just skirt around it by calling this mutation after the whole batch
     * of transactions have been sent, assuming that by that time, the subgraph
     * had time to ingest the new block in which the colony was created.
     *
     * However, due to various network conditions, this might not be case, and
     * the colony might not exist still.
     *
     * It's not a super-huge deal breaker, as a page refresh will solve it,
     * and the colony is still usable, just that it doesn't provide _that_
     * nice of a user experience.
     */
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

    return null;
  } catch (error) {
    yield putError(ActionTypes.COLONY_CREATE_ERROR, error, meta);
    // For non-transaction errors (where something is probably irreversibly wrong),
    // cancel the saga.
    return null;
  } finally {
    /*
     * Close all transaction channels.
     */
    yield all(
      Object.keys(channels).map((id) =>
        call([channels[id].channel, channels[id].channel.close]),
      ),
    );
  }
}

export default function* colonyCreateSaga() {
  yield takeLatestCancellable(
    ActionTypes.COLONY_CREATE,
    ActionTypes.COLONY_CREATE_CANCEL,
    colonyCreate,
  );
}
