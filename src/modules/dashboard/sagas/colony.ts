import ApolloClient from 'apollo-client';
import {
  call,
  fork,
  put,
  takeEvery,
  takeLatest,
  select,
} from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { ContractContexts } from '~types/index';
import {
  EditColonyProfileDocument,
  EditColonyProfileMutation,
  EditColonyProfileMutationVariables,
  ColonyDocument,
  ColonyQuery,
  ColonyQueryVariables,
} from '~data/index';
import { getContext, Context } from '~context/index';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';
import { networkVersionSelector } from '../../core/selectors';

function* colonyAvatarUpload({
  meta,
  payload: { colonyAddress, data },
}: Action<ActionTypes.COLONY_AVATAR_UPLOAD>) {
  try {
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    const ipfsHash = yield call(ipfsUpload, data);

    yield apolloClient.mutate<
      EditColonyProfileMutation,
      EditColonyProfileMutationVariables
    >({
      mutation: EditColonyProfileDocument,
      variables: { input: { colonyAddress, avatarHash: ipfsHash } },
    });

    yield put<AllActions>({
      type: ActionTypes.COLONY_AVATAR_UPLOAD_SUCCESS,
      meta,
      payload: { hash: ipfsHash },
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_AVATAR_UPLOAD_ERROR, error, meta);
  }
  return null;
}

function* colonyAvatarRemove({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_AVATAR_REMOVE>) {
  try {
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    yield apolloClient.mutate<
      EditColonyProfileMutation,
      EditColonyProfileMutationVariables
    >({
      mutation: EditColonyProfileDocument,
      variables: { input: { colonyAddress, avatarHash: null } },
    });
    yield put<AllActions>({
      type: ActionTypes.COLONY_AVATAR_REMOVE_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_AVATAR_REMOVE_ERROR, error, meta);
  }
  return null;
}

function* colonyRecoveryModeEnter({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_RECOVERY_MODE_ENTER>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'enterRecoveryMode',
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put({
      type: ActionTypes.COLONY_RECOVERY_MODE_ENTER_SUCCESS,
      meta,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    yield apolloClient.query<ColonyQuery, ColonyQueryVariables>({
      query: ColonyDocument,
      variables: {
        address: colonyAddress,
      },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_RECOVERY_MODE_ENTER_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

function* colonyUpgradeContract({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_VERSION_UPGRADE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  const newVersion = yield select(networkVersionSelector);

  try {
    yield fork(createTransaction, meta.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'upgrade',
      identifier: colonyAddress,
      params: { newVersion },
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put({
      type: ActionTypes.COLONY_VERSION_UPGRADE_SUCCESS,
      meta,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    yield apolloClient.query<ColonyQuery, ColonyQueryVariables>({
      query: ColonyDocument,
      variables: {
        address: colonyAddress,
      },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_VERSION_UPGRADE_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

function* colonyNativeTokenUnlock({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ContractContexts.TOKEN_CONTEXT,
      methodName: 'unlock',
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put({
      type: ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK_SUCCESS,
      meta,
    });

    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    yield apolloClient.query<ColonyQuery, ColonyQueryVariables>({
      query: ColonyDocument,
      variables: {
        address: colonyAddress,
      },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* colonySagas() {
  yield takeEvery(
    ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK,
    colonyNativeTokenUnlock,
  );
  yield takeEvery(
    ActionTypes.COLONY_RECOVERY_MODE_ENTER,
    colonyRecoveryModeEnter,
  );
  yield takeEvery(ActionTypes.COLONY_VERSION_UPGRADE, colonyUpgradeContract);

  /*
   * Note that the following actions use `takeLatest` because they are
   * dispatched on user keyboard input and use the `delay` saga helper.
   */
  yield takeLatest(ActionTypes.COLONY_AVATAR_REMOVE, colonyAvatarRemove);
  yield takeLatest(ActionTypes.COLONY_AVATAR_UPLOAD, colonyAvatarUpload);
}
