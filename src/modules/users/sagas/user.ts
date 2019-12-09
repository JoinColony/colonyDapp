import ApolloClient from 'apollo-client';
import { push } from 'connected-react-router';
import BigNumber from 'bn.js';
import {
  call,
  delay,
  fork,
  put,
  takeEvery,
  takeLatest,
  setContext,
  all,
} from 'redux-saga/effects';

import { ZERO_ADDRESS } from '~utils/web3/constants';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { getContext, Context } from '~context/index';
import ENS from '~lib/ENS';
import { getLoggedInUser } from '~data/helpers';
import {
  CreateUserDocument,
  EditUserDocument,
  ColonySubscribedUsersDocument,
  UserColonyIdsQueryResult,
} from '~data/index';

import { UserTokenReferenceType } from '~immutable/index';
import { executeQuery, putError, takeFrom } from '~utils/saga/effects';

import { ContractContexts } from '../../../lib/ColonyManager/constants';

import { ipfsUpload } from '../../core/sagas/ipfs';
import { transactionLoadRelated } from '../../core/actionCreators';

import { getUserAddress, getUserColonyTransactions } from '../data/queries';

import { createTransaction, getTxChannel } from '../../core/sagas/transactions';

function* userTokenTransfersFetch( // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  action: Action<ActionTypes.USER_TOKEN_TRANSFERS_FETCH>,
) {
  try {
    const { walletAddress } = yield getLoggedInUser();
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const { data }: UserColonyIdsQueryResult = yield apolloClient.query({
      query: ColonySubscribedUsersDocument,
      variables: { address: walletAddress },
    });

    if (!data) {
      throw new Error('Could not get user colonies');
    }

    const {
      user: { colonies },
    } = data;
    const colonyAddresses = colonies.map(({ id }) => id);

    const transactions = yield executeQuery(getUserColonyTransactions, {
      args: {
        walletAddress,
        userColonyAddresses: colonyAddresses,
      },
    });
    yield put<AllActions>({
      type: ActionTypes.USER_TOKEN_TRANSFERS_FETCH_SUCCESS,
      payload: { transactions },
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_TOKEN_TRANSFERS_FETCH_ERROR, error);
  }
  return null;
}

function* userAddressFetch({
  payload: { username },
  meta,
}: Action<ActionTypes.USER_ADDRESS_FETCH>) {
  try {
    const userAddress = yield executeQuery(getUserAddress, {
      args: { username },
    });

    yield put({
      type: ActionTypes.USER_ADDRESS_FETCH_SUCCESS,
      payload: { userAddress },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_ADDRESS_FETCH_ERROR, error, meta);
  }
  return null;
}

function* userAvatarRemove({ meta }: Action<ActionTypes.USER_AVATAR_REMOVE>) {
  try {
    const { walletAddress } = yield getLoggedInUser();
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    yield apolloClient.mutate({
      mutation: EditUserDocument,
      variables: { input: { avatarHash: null } },
    });

    yield put<AllActions>({
      type: ActionTypes.USER_AVATAR_REMOVE_SUCCESS,
      payload: { address: walletAddress },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_AVATAR_REMOVE_ERROR, error, meta);
  }
  return null;
}

function* userAvatarUpload({
  meta,
  payload,
}: Action<ActionTypes.USER_AVATAR_UPLOAD>) {
  try {
    const { walletAddress } = yield getLoggedInUser();
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    const ipfsHash = yield call(ipfsUpload, payload.data);

    yield apolloClient.mutate({
      mutation: EditUserDocument,
      variables: { input: { avatarHash: ipfsHash } },
    });

    yield put<AllActions>({
      type: ActionTypes.USER_AVATAR_UPLOAD_SUCCESS,
      meta,
      payload: {
        hash: ipfsHash,
        avatar: payload.data,
        address: walletAddress,
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_AVATAR_UPLOAD_ERROR, error, meta);
  }
  return null;
}

function* usernameCheckAvailability({
  meta,
  payload: { username },
}: Action<ActionTypes.USERNAME_CHECK_AVAILABILITY>) {
  try {
    yield delay(300);

    const colonyManager = yield getContext(Context.COLONY_MANAGER);
    const ens = yield getContext(Context.ENS_INSTANCE);

    const isAvailable = yield call(
      [ens, ens.isENSNameAvailable],
      'user',
      username,
      colonyManager.networkClient,
    );

    if (!isAvailable) {
      throw new Error(`ENS address for user "${username}" already exists`);
    }

    yield put<AllActions>({
      type: ActionTypes.USERNAME_CHECK_AVAILABILITY_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.USERNAME_CHECK_AVAILABILITY_ERROR,
      error,
      meta,
    );
  }
  return null;
}

function* usernameCreate({
  meta: { id },
  meta,
  payload: { username: givenUsername },
}: Action<ActionTypes.USERNAME_CREATE>) {
  const txChannel = yield call(getTxChannel, id);
  try {
    // Normalize again, just to be sure
    const username = ENS.normalize(givenUsername);

    yield fork(createTransaction, id, {
      context: ContractContexts.NETWORK_CONTEXT,
      methodName: 'registerUserLabel',
      ready: true,
      params: { username, orbitDBPath: '' },
      group: {
        key: 'transaction.batch.createUser',
        id,
        index: 0,
      },
    });

    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(transactionLoadRelated(id, true));

    yield apolloClient.mutate({
      mutation: CreateUserDocument,
      variables: {
        createUserInput: { username },
        loggedInUserInput: { username },
      },
    });

    yield put(transactionLoadRelated(id, false));

    yield put<AllActions>({
      type: ActionTypes.USERNAME_CREATE_SUCCESS,
      payload: {
        username,
      },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.USERNAME_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

function* userLogout() {
  const ddb = yield getContext(Context.DDB_INSTANCE);

  try {
    /*
     *  1. Destroy instances of colonyJS in the colonyManager? Probably.
     */
    yield setContext({
      [Context.COLONY_MANAGER]: undefined,
    });

    /*
     *  2. The purser wallet is reset
     */
    yield setContext({ [Context.WALLET]: undefined });

    /*
     *  3. Close orbit store
     */
    yield call([ddb, ddb.stop]);

    yield all([
      put<AllActions>({
        type: ActionTypes.USER_LOGOUT_SUCCESS,
      }),
      put(push('/dashboard')),
    ]);
  } catch (error) {
    return yield putError(ActionTypes.USER_LOGOUT_ERROR, error);
  }
  return null;
}

function* userTokensFetch() {
  try {
    const { walletAddress } = yield getLoggedInUser();
    const colonyManager = yield getContext(Context.COLONY_MANAGER);
    const {
      networkClient: {
        adapter: { provider },
      },
    } = colonyManager;

    // FIXME get user tokens from apollo here
    const tokenAddresses = [] as string[];
    const coinTokens: UserTokenReferenceType[] = yield Promise.all(
      tokenAddresses.map(async address => {
        const tokenClient = await colonyManager.getTokenClient(address);
        const { amount } = await tokenClient.getBalanceOf.call({
          sourceAddress: walletAddress,
        });
        // convert from Ethers BN
        const balance = new BigNumber(amount.toString());
        return { address, balance };
      }),
    );

    // also get balance for ether and return in same format
    const etherBalance = yield provider.getBalance(walletAddress);
    const etherToken = {
      address: ZERO_ADDRESS,
      // convert from Ethers BN
      balance: new BigNumber(etherBalance.toString()),
    };

    const tokens = [etherToken, ...coinTokens];
    yield put<AllActions>({
      type: ActionTypes.USER_TOKENS_FETCH_SUCCESS,
      payload: { tokens },
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_TOKENS_FETCH_ERROR, error);
  }
  return null;
}

// We need to do this in a saga as we want to trigger the USER_TOKENS_FETCH action again
function* userTokensUpdate(action: Action<ActionTypes.USER_TOKENS_UPDATE>) {
  try {
    const { tokens } = action.payload;
    const { walletAddress } = yield getLoggedInUser();
    // We probably don't need the wallet address
    // FIXME update tokens here (apollo mutation)

    yield put({ type: ActionTypes.USER_TOKENS_FETCH });
    yield put({ type: ActionTypes.USER_TOKENS_UPDATE_SUCCESS });
  } catch (error) {
    return yield putError(ActionTypes.USER_TOKENS_UPDATE_ERROR, error);
  }
  return null;
}

export function* setupUsersSagas() {
  yield takeEvery(ActionTypes.USER_ADDRESS_FETCH, userAddressFetch);
  yield takeEvery(
    ActionTypes.USER_TOKEN_TRANSFERS_FETCH,
    userTokenTransfersFetch,
  );
  yield takeEvery(ActionTypes.USER_TOKENS_FETCH, userTokensFetch);
  yield takeLatest(
    ActionTypes.USERNAME_CHECK_AVAILABILITY,
    usernameCheckAvailability,
  );
  yield takeLatest(ActionTypes.USER_AVATAR_REMOVE, userAvatarRemove);
  yield takeLatest(ActionTypes.USER_AVATAR_UPLOAD, userAvatarUpload);
  yield takeLatest(ActionTypes.USER_LOGOUT, userLogout);
  yield takeLatest(ActionTypes.USER_TOKENS_UPDATE, userTokensUpdate);
  yield takeLatest(ActionTypes.USERNAME_CREATE, usernameCreate);
}
