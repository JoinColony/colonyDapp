import ApolloClient from 'apollo-client';
import {
  call,
  fork,
  put,
  takeEvery,
  takeLatest,
  setContext,
} from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { getContext, Context, TEMP_removeNewContext } from '~context/index';
import ENS from '~lib/ENS';
import { ColonyManager, createAddress } from '~types/index';
import {
  getLoggedInUser,
  refetchUserNotifications,
  ColonySubscribedUsersDocument,
  CreateUserDocument,
  CreateUserMutation,
  CreateUserMutationVariables,
  EditUserDocument,
  EditUserMutation,
  EditUserMutationVariables,
  UserColonyAddressesQuery,
  UserColonyAddressesQueryVariables,
  ClearLoggedInUserDocument,
  ClearLoggedInUserMutation,
  ClearLoggedInUserMutationVariables,
} from '~data/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { getEventLogs, parseUserTransferEvent } from '~utils/web3/eventLogs';

import { clearToken } from '../../../api/auth';
import { ContractContexts } from '../../../lib/ColonyManager/constants';
import { ipfsUpload } from '../../core/sagas/ipfs';
import { transactionLoadRelated } from '../../core/actionCreators';
import { createTransaction, getTxChannel } from '../../core/sagas/transactions';

function* userTokenTransfersFetch( // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  action: Action<ActionTypes.USER_TOKEN_TRANSFERS_FETCH>,
) {
  try {
    const { walletAddress } = yield getLoggedInUser();
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    const colonyManager: ColonyManager = yield getContext(
      Context.COLONY_MANAGER,
    );

    const { data } = yield apolloClient.query<
      UserColonyAddressesQuery,
      UserColonyAddressesQueryVariables
    >({
      query: ColonySubscribedUsersDocument,
      variables: { address: walletAddress },
    });

    if (!data) {
      throw new Error('Could not get user colonies');
    }

    const {
      user: { colonyAddresses: userColonyAddresses },
    } = data;

    const metaColonyClient = yield colonyManager.getMetaColonyClient();

    const { tokenClient } = metaColonyClient;
    const {
      events: { Transfer },
    } = tokenClient;
    const logFilterOptions = {
      events: [Transfer],
    };

    const transferToEventLogs = yield getEventLogs(
      tokenClient,
      { fromBlock: 1 },
      {
        ...logFilterOptions,
        to: walletAddress,
      },
    );

    const transferFromEventLogs = yield getEventLogs(
      tokenClient,
      { fromBlock: 1 },
      {
        ...logFilterOptions,
        from: walletAddress,
      },
    );

    // Combine and sort logs by blockNumber, then parse events from thihs
    const logs = [...transferToEventLogs, ...transferFromEventLogs].sort(
      (a, b) => a.blockNumber - b.blockNumber,
    );
    const transferEvents = yield tokenClient.parseLogs(logs);

    const transactions = yield Promise.all(
      transferEvents.map((event, i) =>
        parseUserTransferEvent({
          event,
          log: logs[i],
          tokenClient,
          userColonyAddresses,
          walletAddress,
        }),
      ),
    );

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
    const ens: ENS = yield getContext(Context.ENS_INSTANCE);
    const colonyManager: ColonyManager = yield getContext(
      Context.COLONY_MANAGER,
    );

    const address = yield ens.getAddress(
      ENS.getFullDomain('user', username),
      colonyManager.networkClient,
    );

    yield put({
      type: ActionTypes.USER_ADDRESS_FETCH_SUCCESS,
      payload: { userAddress: createAddress(address) },
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
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    yield apolloClient.mutate<EditUserMutation, EditUserMutationVariables>({
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
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    const ipfsHash = yield call(ipfsUpload, payload.data);

    yield apolloClient.mutate<EditUserMutation, EditUserMutationVariables>({
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

function* usernameCreate({
  meta: { id },
  meta,
  payload: { username: givenUsername },
}: Action<ActionTypes.USERNAME_CREATE>) {
  const { walletAddress } = yield getLoggedInUser();
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

    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(transactionLoadRelated(id, true));

    yield apolloClient.mutate<CreateUserMutation, CreateUserMutationVariables>({
      mutation: CreateUserDocument,
      variables: {
        createUserInput: { username },
        loggedInUserInput: { username },
      },
    });

    yield put(transactionLoadRelated(id, false));

    yield refetchUserNotifications(walletAddress);

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
  try {
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    const { walletAddress } = yield getLoggedInUser();
    /*
     *  1. Destroy instances of colonyJS in the colonyManager? Probably.
     */
    yield setContext({
      [Context.COLONY_MANAGER]: undefined,
    });

    /*
     *  2. The purser wallet is reset
     */
    TEMP_removeNewContext('wallet');

    /*
     *  3. Delete json web token
     */
    clearToken(walletAddress);

    /*
     *  4. Clear the currently logged in user
     */
    yield apolloClient.mutate<
      ClearLoggedInUserMutation,
      ClearLoggedInUserMutationVariables
    >({
      mutation: ClearLoggedInUserDocument,
    });

    yield put<AllActions>({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_LOGOUT_ERROR, error);
  }
  return null;
}

export function* setupUsersSagas() {
  yield takeEvery(ActionTypes.USER_ADDRESS_FETCH, userAddressFetch);
  yield takeEvery(
    ActionTypes.USER_TOKEN_TRANSFERS_FETCH,
    userTokenTransfersFetch,
  );
  yield takeLatest(ActionTypes.USER_AVATAR_REMOVE, userAvatarRemove);
  yield takeLatest(ActionTypes.USER_AVATAR_UPLOAD, userAvatarUpload);
  yield takeLatest(ActionTypes.USER_LOGOUT, userLogout);
  yield takeLatest(ActionTypes.USERNAME_CREATE, usernameCreate);
}
