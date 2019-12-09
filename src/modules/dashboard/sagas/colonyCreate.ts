import ApolloClient from 'apollo-client';
import { $Values } from 'utility-types';
import { Channel } from 'redux-saga';
import { all, call, fork, put } from 'redux-saga/effects';

import { ActionTypes, Action, AllActions } from '~redux/index';
import { putError, takeFrom, takeLatestCancellable } from '~utils/saga/effects';
import { Context, getContext } from '~context/index';
import ENS from '~lib/ENS';
import { createAddress, ContractContexts } from '~types/index';
import { parseExtensionDeployedLog } from '~utils/web3/eventLogs/eventParsers';
import { getLoggedInUser } from '~data/helpers';
import { CreateUserDocument, CreateColonyDocument } from '~data/index';

import { TxConfig } from '../../core/types';
import {
  transactionAddParams,
  transactionAddIdentifier,
  transactionReady,
  transactionLoadRelated,
} from '../../core/actionCreators';
import { createTransaction, createTransactionChannels } from '../../core/sagas';

function* colonyCreate({
  meta,
  payload: {
    colonyName: givenColonyName,
    displayName,
    tokenAddress: givenTokenAddress,
    tokenChoice,
    tokenIcon,
    tokenName,
    tokenSymbol,
    username: givenUsername,
  },
}: Action<ActionTypes.COLONY_CREATE>) {
  const { username: currentUsername } = yield getLoggedInUser();

  const apolloClient: ApolloClient<any> = yield getContext(
    Context.APOLLO_CLIENT,
  );

  const TOKEN_DECIMALS = 18;

  /*
   * Define a manifest of transaction ids and their respective channels.
   */
  const channels: {
    [id: string]: { channel: Channel<any>; index: number; id: string };
  } = yield call(createTransactionChannels, meta.id, [
    /*
     * If the user did not claim a profile yet, define a tx to create the user.
     */
    ...(!currentUsername ? ['createUser'] : []),
    /*
     * If the user opted to create a token, define a tx to create the token.
     */
    ...(tokenChoice === 'create' ? ['createToken'] : []),
    /*
     * Always create the following transactions..
     */
    'createColony',
    'createLabel',
    /*
     * If the user opted to create a token, define txs to manage the token.
     */
    ...(tokenChoice === 'create'
      ? ['deployTokenAuthority', 'setTokenAuthority']
      : []),
    /*
     * Always create the following transactions.
     */
    'deployOneTx',
    'setOneTxRoleAdministration',
    'setOneTxRoleFunding',
  ]);
  const {
    createColony,
    createLabel,
    createToken,
    createUser,
    deployOneTx,
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
    const colonyName = ENS.normalize(givenColonyName);
    const username = ENS.normalize(givenUsername);

    if (createUser) {
      yield createGroupedTransaction(createUser, {
        context: ContractContexts.NETWORK_CONTEXT,
        methodName: 'registerUserLabel',
        params: { username, orbitDBPath: '' },
        ready: true,
      });
    }

    if (createToken) {
      yield createGroupedTransaction(createToken, {
        context: ContractContexts.NETWORK_CONTEXT,
        methodName: 'createToken',
        params: {
          name: tokenName,
          symbol: tokenSymbol,
          decimals: TOKEN_DECIMALS,
        },
      });
    }

    yield createGroupedTransaction(createColony, {
      context: ContractContexts.NETWORK_CONTEXT,
      methodName: 'createColony',
      ready: false,
    });

    yield createGroupedTransaction(createLabel, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'registerColonyLabel',
      params: { colonyName },
      ready: false,
    });

    if (createToken) {
      yield createGroupedTransaction(deployTokenAuthority, {
        context: ContractContexts.TOKEN_CONTEXT,
        methodName: 'createTokenAuthority',
        params: { allowedToTransfer: [] },
        ready: false,
      });

      yield createGroupedTransaction(setTokenAuthority, {
        context: ContractContexts.TOKEN_CONTEXT,
        methodName: 'setAuthority',
        ready: false,
      });
    }

    yield createGroupedTransaction(deployOneTx, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'addExtension',
      params: { contractName: 'OneTxPayment' },
      ready: false,
    });

    yield createGroupedTransaction(setOneTxRoleAdministration, {
      context: ContractContexts.COLONY_CONTEXT,
      methodContext: 'setOneTxRoles',
      methodName: 'setAdministrationRole',
      params: { setTo: true, domainId: 1 },
      ready: false,
    });

    yield createGroupedTransaction(setOneTxRoleFunding, {
      context: ContractContexts.COLONY_CONTEXT,
      methodContext: 'setOneTxRoles',
      methodName: 'setFundingRole',
      params: { setTo: true, domainId: 1 },
      ready: false,
    });

    /*
     * Wait until all transactions are created.
     */
    yield all(
      Object.keys(channels).map(id =>
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

      yield apolloClient.mutate({
        mutation: CreateUserDocument,
        variables: {
          createUserInput: { username },
          loggedInUserInput: { username },
        },
      });

      yield put<AllActions>(transactionLoadRelated(createUser.id, false));
    }

    /*
     * For transactions that rely on the receipt/event data of previous transactions,
     * wait for these transactions to succeed, collect the data, and apply it to
     * the pending transactions.
     */
    let tokenAddress: string;
    if (createToken) {
      ({
        payload: {
          transaction: {
            receipt: { contractAddress: tokenAddress },
          },
        },
      } = yield takeFrom(
        createToken.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      ));
    } else {
      if (!givenTokenAddress) {
        throw new Error('Token address not provided');
      }
      tokenAddress = givenTokenAddress;
    }
    tokenAddress = createAddress(tokenAddress);

    /*
     * Pass through tokenAddress after token creation to the colony creation
     * transaction and wait for it to succeed.
     */
    yield put(transactionAddParams(createColony.id, { tokenAddress }));
    yield put(transactionReady(createColony.id));

    const {
      payload: {
        eventData: { colonyAddress },
      },
    } = yield takeFrom(createColony.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (!colonyAddress) {
      return yield putError(
        ActionTypes.COLONY_CREATE_ERROR,
        new Error('Missing colony address'),
        meta,
      );
    }

    yield put(transactionLoadRelated(createColony.id, true));

    /*
     * Create the colony in the Mongo Database
     */
    yield apolloClient.mutate({
      mutation: CreateColonyDocument,
      variables: {
        input: {
          colonyAddress,
          colonyName,
          displayName,
          tokenAddress,
          tokenName,
          tokenSymbol,
          tokenIconHash: tokenIcon,
          tokenDecimals: TOKEN_DECIMALS,
        },
      },
    });

    yield put(transactionLoadRelated(createColony.id, false));

    /*
     * Add a colonyAddress identifier to all pending transactions.
     */
    yield all(
      [
        createLabel,
        deployTokenAuthority,
        setTokenAuthority,
        deployOneTx,
        setOneTxRoleAdministration,
        setOneTxRoleFunding,
      ]
        .filter(Boolean)
        .map(({ id }) => put(transactionAddIdentifier(id, colonyAddress))),
    );

    /*
     * Create label
     */
    yield put(transactionReady(createLabel.id));
    yield takeFrom(createLabel.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (deployTokenAuthority) {
      /*
       * Deploy TokenAuthority
       */
      yield put(
        transactionAddParams(deployTokenAuthority.id, {
          colonyAddress,
          tokenAddress,
        }),
      );
      yield put(transactionReady(deployTokenAuthority.id));
      const {
        payload: {
          transaction: {
            receipt: { contractAddress: tokenAuthorityAddress },
          },
        },
      } = yield takeFrom(
        deployTokenAuthority.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );

      /*
       * Set Token authority (to deployed TokenAuthority)
       */
      yield put(
        transactionAddParams(setTokenAuthority.id, {
          authority: tokenAuthorityAddress,
        }),
      );
      yield put(transactionReady(setTokenAuthority.id));
      yield takeFrom(
        setTokenAuthority.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    /*
     * Deploy OneTx
     */
    yield put(transactionReady(deployOneTx.id));

    const {
      payload: {
        transaction: {
          receipt: {
            logs: [deployOneTxLog],
          },
        },
      },
    } = yield takeFrom(deployOneTx.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    const oneTxAddress = parseExtensionDeployedLog(deployOneTxLog);

    /*
     * Set OneTx administration role
     */
    yield put(
      transactionAddParams(setOneTxRoleAdministration.id, {
        address: oneTxAddress,
      }),
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
      transactionAddParams(setOneTxRoleFunding.id, { address: oneTxAddress }),
    );
    yield put(transactionReady(setOneTxRoleFunding.id));
    yield takeFrom(
      setOneTxRoleFunding.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );
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
      Object.keys(channels).map(id =>
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
