import { $Values } from 'utility-types';
import { Channel } from 'redux-saga';
import { all, call, fork, put } from 'redux-saga/effects';
import {
  ClientType,
  ROOT_DOMAIN_ID,
  ColonyVersion,
  ColonyClient,
  ColonyRole,
  TokenClientType,
} from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { ContextModule, TEMP_getContext } from '~context/index';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import {
  getLoggedInUser,
  refetchUserNotifications,
  ColonyProfileDocument,
  ColonyProfileQuery,
  ColonyProfileQueryVariables,
  CreateColonyDocument,
  CreateColonyMutation,
  CreateColonyMutationVariables,
  CreateUserMutation,
  CreateUserDocument,
  CreateUserMutationVariables,
  UserColonyAddressesDocument,
  UserColonyAddressesQueryVariables,
  UserColonyAddressesQuery,
} from '~data/index';
import ENS from '~lib/ENS';
import { ActionTypes, Action, AllActions } from '~redux/index';
import { createAddress } from '~utils/web3';
import { log } from '~utils/debug';
import { putError, takeFrom, takeLatestCancellable } from '~utils/saga/effects';
import { TxConfig } from '~types/index';

import {
  transactionAddParams,
  transactionAddIdentifier,
  transactionReady,
  transactionLoadRelated,
} from '../../core/actionCreators';
import { createTransaction, createTransactionChannels } from '../../core/sagas';

interface ChannelDefinition {
  channel: Channel<any>;
  index: number;
  id: string;
}

interface ColonyRecoveryInfo {
  isProfileCreated: boolean;
  isNativeTokenColonyToken: boolean;
  isTokenAuthoritySetUp: boolean;
  isOneTxExtensionDeployed: boolean;
  isCoinMachineExtensionDeployed: boolean;
  hasOneTxAdminRole: boolean;
  hasOneTxFundingRole: boolean;
  colonyAddress: string;
  colonyName: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
}

function* getRecoveryInfo(recoveryAddress: string) {
  const { username, walletAddress } = yield getLoggedInUser();
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
  const { networkClient } = TEMP_getContext(ContextModule.ColonyManager);
  const ens = TEMP_getContext(ContextModule.ENS);

  const colonyInfo: ColonyRecoveryInfo = {
    isProfileCreated: false,
    isNativeTokenColonyToken: false,
    isTokenAuthoritySetUp: false,
    isOneTxExtensionDeployed: false,
    isCoinMachineExtensionDeployed: false,
    hasOneTxAdminRole: false,
    hasOneTxFundingRole: false,
    colonyAddress: '',
    colonyName: '',
    tokenAddress: '',
    tokenName: '',
    tokenSymbol: '',
  };

  if (!username) {
    throw new Error('User does not have a username associated.');
  }

  const colonyClient: ColonyClient = yield networkClient.getColonyClient(
    recoveryAddress,
  );

  const domain = yield ens.getDomain(colonyClient.address, networkClient);
  colonyInfo.colonyName = ENS.stripDomainParts('colony', domain);

  const hasRecoveryRole = yield colonyClient.hasUserRole(
    walletAddress,
    ROOT_DOMAIN_ID,
    ColonyRole.Recovery,
  );

  if (!hasRecoveryRole) {
    throw new Error('User does not have the permission to recovery colony');
  }

  try {
    yield apolloClient.query<ColonyProfileQuery, ColonyProfileQueryVariables>({
      query: ColonyProfileDocument,
      variables: {
        address: colonyClient.address,
      },
    });
    colonyInfo.isProfileCreated = true;
  } catch {
    colonyInfo.isProfileCreated = false;
  }

  const { tokenClient } = colonyClient;

  const tokenInfo = yield tokenClient.getTokenInfo();

  colonyInfo.tokenName = tokenInfo.name;
  colonyInfo.tokenSymbol = tokenInfo.symbol;

  colonyInfo.colonyAddress = colonyClient.address;
  colonyInfo.tokenAddress = tokenClient.address;

  if (tokenClient.tokenClientType === TokenClientType.Colony) {
    colonyInfo.isNativeTokenColonyToken = true;
    const tokenAuthority = yield tokenClient.authority();
    if (tokenAuthority !== AddressZero) {
      colonyInfo.isTokenAuthoritySetUp = true;
    }
  }

  const { oneTxPaymentFactoryClient, coinMachineFactoryClient } = networkClient;

  // eslint-disable-next-line max-len
  const oneTxExtensionAddress = yield oneTxPaymentFactoryClient.deployedExtensions(
    recoveryAddress,
  );

  if (oneTxExtensionAddress !== AddressZero) {
    colonyInfo.isOneTxExtensionDeployed = true;
    colonyInfo.hasOneTxAdminRole = yield colonyClient.hasUserRole(
      oneTxExtensionAddress,
      ROOT_DOMAIN_ID,
      ColonyRole.Administration,
    );
    colonyInfo.hasOneTxFundingRole = yield colonyClient.hasUserRole(
      oneTxExtensionAddress,
      ROOT_DOMAIN_ID,
      ColonyRole.Funding,
    );
  }

  // eslint-disable-next-line max-len
  const coinMachineExtensionAddress = yield coinMachineFactoryClient.deployedExtensions(
    recoveryAddress,
  );

  if (coinMachineExtensionAddress !== AddressZero) {
    colonyInfo.isCoinMachineExtensionDeployed = true;
  }

  return colonyInfo;
}

function* colonyCreate({
  meta,
  payload: {
    colonyName: givenColonyName,
    displayName,
    recover: recoveryAddress,
    tokenAddress: givenTokenAddress,
    tokenChoice,
    tokenIcon,
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

  let recoveryInfo: ColonyRecoveryInfo | undefined;

  if (recoveryAddress) {
    recoveryInfo = yield getRecoveryInfo(recoveryAddress);
  }

  /*
   * If the user did not claim a profile yet, define a tx to create the user.
   */
  if (!currentUsername && !recoveryAddress) channelNames.push('createUser');
  /*
   * If the user opted to create a token, define a tx to create the token.
   */
  if (tokenChoice === 'create' && !recoveryAddress) {
    channelNames.push('createToken');
  }
  if (!recoveryAddress) channelNames.push('createColony');
  /*
   * If the user opted to create a token,  define txs to manage the token.
   */
  if (
    tokenChoice === 'create' &&
    (!recoveryAddress || (recoveryInfo && !recoveryInfo.isTokenAuthoritySetUp))
  ) {
    channelNames.push('deployTokenAuthority');
    channelNames.push('setTokenAuthority');
  }

  if (
    !recoveryAddress ||
    (recoveryInfo && !recoveryInfo.isOneTxExtensionDeployed)
  ) {
    channelNames.push('deployOneTx');
  }

  if (!recoveryAddress || (recoveryInfo && !recoveryInfo.hasOneTxAdminRole)) {
    channelNames.push('setOneTxRoleAdministration');
  }

  if (!recoveryAddress || (recoveryInfo && !recoveryInfo.hasOneTxFundingRole)) {
    channelNames.push('setOneTxRoleFunding');
  }

  if (
    !recoveryAddress ||
    (recoveryInfo &&
      recoveryInfo &&
      !recoveryInfo.isCoinMachineExtensionDeployed)
  ) {
    channelNames.push('deployCoinMachine');
  }

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
    deployCoinMachine,
    setOneTxRoleAdministration,
    setOneTxRoleFunding,
    deployTokenAuthority,
    setTokenAuthority,
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
    const colonyName = ENS.normalize(
      (recoveryInfo && recoveryInfo.colonyName) || givenColonyName,
    );
    const username = ENS.normalize(givenUsername);

    const tokenName =
      (recoveryInfo && recoveryInfo.tokenName) || givenTokenName;
    const tokenSymbol =
      (recoveryInfo && recoveryInfo.tokenSymbol) || givenTokenSymbol;

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
        methodName: 'createColony(address,uint256,string,string,bool)',
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

    if (deployOneTx) {
      yield createGroupedTransaction(deployOneTx, {
        context: ClientType.OneTxPaymentFactoryClient,
        methodName: 'deployExtension',
        ready: false,
      });
    }

    if (deployCoinMachine) {
      yield createGroupedTransaction(deployCoinMachine, {
        context: ClientType.CoinMachineFactoryClient,
        methodName: 'deployExtension',
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
    } else if (recoveryInfo && recoveryInfo.tokenAddress) {
      tokenAddress = recoveryInfo.tokenAddress;
    } else {
      if (!givenTokenAddress) {
        throw new Error('Token address not provided');
      }
      tokenAddress = createAddress(givenTokenAddress);
    }

    /**
     * If we're not recovering this will be overwritten
     */
    let colonyAddress = (recoveryInfo && recoveryInfo.colonyAddress) || '';

    if (createColony) {
      yield put(
        transactionAddParams(createColony.id, [
          tokenAddress,
          ColonyVersion.BurgundyGlider,
          colonyName,
          '',
          true,
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

      yield put(transactionLoadRelated(createColony.id, true));
    }

    if (!colonyAddress) {
      return yield putError(
        ActionTypes.COLONY_CREATE_ERROR,
        new Error('Missing colony address'),
        meta,
      );
    }

    if (!recoveryAddress || (recoveryInfo && !recoveryInfo.isProfileCreated)) {
      /*
       * Create the colony in the Mongo Database
       */
      yield apolloClient.mutate<
        CreateColonyMutation,
        CreateColonyMutationVariables
      >({
        mutation: CreateColonyDocument,
        variables: {
          input: {
            colonyAddress,
            colonyName,
            displayName,
            tokenAddress,
            tokenIsExternal: !createToken,
            tokenName,
            tokenSymbol,
            tokenIconHash: tokenIcon,
            tokenDecimals: DEFAULT_TOKEN_DECIMALS,
          },
        },
        update: (cache) => {
          try {
            const cacheData = cache.readQuery<
              UserColonyAddressesQuery,
              UserColonyAddressesQueryVariables
            >({
              query: UserColonyAddressesDocument,
              variables: {
                address: walletAddress,
              },
            });
            if (cacheData) {
              const existingColonyAddresses =
                cacheData.user.colonyAddresses || [];
              const colonyAddresses = [
                ...existingColonyAddresses,
                colonyAddress,
              ];
              cache.writeQuery<
                UserColonyAddressesQuery,
                UserColonyAddressesQueryVariables
              >({
                query: UserColonyAddressesDocument,
                data: {
                  user: {
                    ...cacheData.user,
                    colonyAddresses,
                  },
                },
                variables: {
                  address: walletAddress,
                },
              });
            }
          } catch (e) {
            log.error(e);
          }
        },
      });

      if (createColony) {
        yield put(transactionLoadRelated(createColony.id, false));
      }
    }

    /*
     * Add a colonyAddress identifier to all pending transactions.
     */
    yield all(
      [
        deployTokenAuthority,
        setTokenAuthority,
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

    if (deployOneTx) {
      yield put(transactionAddParams(deployOneTx.id, [colonyAddress]));
      yield put(transactionReady(deployOneTx.id));

      const {
        payload: {
          eventData: {
            ExtensionDeployed: { _extension: extensionAddress },
          },
        },
      } = yield takeFrom(
        deployOneTx.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );

      /*
       * Set OneTx administration role
       */
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

      yield takeFrom(
        setOneTxRoleFunding.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    if (deployCoinMachine) {
      yield put(transactionAddParams(deployCoinMachine.id, [colonyAddress]));
      yield put(transactionReady(deployCoinMachine.id));
    }

    // Re-initialize the colony-client to make sure we have included all the
    // extensions
    yield colonyManager.setColonyClient(colonyAddress);

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
