import {
  all,
  call,
  delay,
  fork,
  put,
  take,
  takeEvery,
  takeLatest,
  select,
} from 'redux-saga/effects';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import { Action, ActionTypes, AllActions } from '~redux/index';
import {
  putError,
  takeFrom,
  executeQuery,
  executeSubscription,
  selectAsJS,
} from '~utils/saga/effects';
import { ColonyRolesType } from '~immutable/index';
import { ContractContexts, createAddress } from '~types/index';

import {
  checkColonyNameIsAvailable,
  getColony,
  getColonyCanMintNativeToken,
  getColonyTasks,
  getColonyTokenBalance,
  subscribeToColony,
  subscribeToColonyTasks,
} from '../data/queries';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';
import { networkVersionSelector } from '../../core/selectors';
import {
  fetchColony,
  fetchDomains,
  fetchToken,
  fetchColonyCanMintNativeToken,
  fetchColonyTokenBalance,
  fetchColonyTokenBalances,
} from '../actionCreators';
import { colonyDomainsSelector, colonySelector } from '../selectors';
import { getColonyAddress, getColonyName } from './shared';
import { EDIT_COLONY } from '../../dashboard/mutations';
import { getContext, Context } from '~context/index';

function* colonyNameCheckAvailability({
  payload: { colonyName },
  meta,
}: Action<ActionTypes.COLONY_NAME_CHECK_AVAILABILITY>) {
  try {
    yield delay(300);

    const isAvailable = yield executeQuery(checkColonyNameIsAvailable, {
      args: { colonyName },
    });

    if (!isAvailable) {
      throw new Error(`ENS address for colony "${colonyName}" already exists`);
    }

    yield put<AllActions>({
      type: ActionTypes.COLONY_NAME_CHECK_AVAILABILITY_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (caughtError) {
    return yield putError(
      ActionTypes.COLONY_NAME_CHECK_AVAILABILITY_ERROR,
      caughtError,
      meta,
    );
  }
  return null;
}

function* colonyFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_FETCH>) {
  try {
    const colony = yield executeQuery(getColony, {
      args: { colonyAddress },
      metadata: { colonyAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.COLONY_FETCH_SUCCESS,
      meta,
      payload: colony,
    });

    yield put<AllActions>(fetchDomains(colonyAddress));

    // dispatch actions to fetch info and balances for each colony token
    yield all(
      Object.keys(colony.tokens || {})
        .map(createAddress)
        .reduce(
          (effects, tokenAddress) => [
            ...effects,
            put(fetchToken(tokenAddress)),
            put(fetchColonyTokenBalances(colonyAddress, tokenAddress)),
          ],
          [],
        ),
    );

    // fetch whether the user is allowed to mint tokens via the colony
    yield put<AllActions>({
      type: ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH,
      meta: { key: colonyAddress },
      payload: { colonyAddress },
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_FETCH_ERROR, error, meta);
  }
  return null;
}

function* colonyAddressFetch({
  payload: { colonyName },
  meta,
}: Action<ActionTypes.COLONY_ADDRESS_FETCH>) {
  try {
    const colonyAddress = yield call(getColonyAddress, colonyName);

    if (!colonyAddress)
      throw new Error(`No Colony address found for ENS name "${colonyName}"`);

    yield put<AllActions>({
      type: ActionTypes.COLONY_ADDRESS_FETCH_SUCCESS,
      meta: { key: colonyAddress },
      payload: { colonyAddress, colonyName },
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_ADDRESS_FETCH_ERROR, error, meta);
  }
  return null;
}

function* colonyNameFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_NAME_FETCH>) {
  try {
    const colonyName = yield call(getColonyName, colonyAddress);
    yield put<AllActions>({
      type: ActionTypes.COLONY_NAME_FETCH_SUCCESS,
      meta,
      payload: { colonyAddress, colonyName },
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_NAME_FETCH_ERROR, error, meta);
  }
  return null;
}

function* colonyAvatarUpload({
  meta,
  payload: { colonyAddress, data },
}: Action<ActionTypes.COLONY_AVATAR_UPLOAD>) {
  try {
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    const ipfsHash = yield call(ipfsUpload, data);

    yield apolloClient.mutate({
      mutation: EDIT_COLONY,
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
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    yield apolloClient.mutate({
      mutation: EDIT_COLONY,
      variables: { input: { colonyAddress, avatarHash: null } },
    });

    yield put<AllActions>({
      type: ActionTypes.COLONY_AVATAR_REMOVE_SUCCESS,
      payload: undefined,
      meta,
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

    yield put(fetchColony(colonyAddress));
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

    yield put(fetchColony(colonyAddress));
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

function* colonyTokenBalanceFetch({
  payload: { colonyAddress, domainId, tokenAddress },
}: Action<ActionTypes.COLONY_TOKEN_BALANCE_FETCH>) {
  try {
    const balance = yield executeQuery(getColonyTokenBalance, {
      args: { domainId, tokenAddress },
      metadata: { colonyAddress },
    });

    yield put({
      type: ActionTypes.COLONY_TOKEN_BALANCE_FETCH_SUCCESS,
      payload: {
        token: {
          address: tokenAddress,
          balances: {
            [domainId]: balance,
          },
        },
        tokenAddress,
        colonyAddress,
      },
    });
  } catch (caughtError) {
    return yield putError(
      ActionTypes.COLONY_TOKEN_BALANCE_FETCH_ERROR,
      caughtError,
    );
  }
  return null;
}

function* colonyTokenBalancesFetch({
  payload: { colonyAddress, tokenAddress },
}: Action<ActionTypes.COLONY_TOKEN_BALANCES_FETCH>) {
  try {
    const { record: domains = {} as ColonyRolesType } = yield selectAsJS(
      colonyDomainsSelector,
      colonyAddress,
    );

    yield all([
      // fetch balances for rewards pots and non-rewards pots
      put(
        fetchColonyTokenBalance(
          colonyAddress,
          tokenAddress,
          COLONY_TOTAL_BALANCE_DOMAIN_ID,
        ),
      ),
      // fetch balances for root domain
      put(fetchColonyTokenBalance(colonyAddress, tokenAddress, ROOT_DOMAIN)),
      // fetch balances for other domains
      ...Object.keys(domains).map(domainId =>
        put(
          fetchColonyTokenBalance(
            colonyAddress,
            tokenAddress,
            parseInt(domainId, 10),
          ),
        ),
      ),
    ]);

    yield put({
      type: ActionTypes.COLONY_TOKEN_BALANCES_FETCH_SUCCESS,
    });
  } catch (caughtError) {
    return yield putError(
      ActionTypes.COLONY_TOKEN_BALANCES_FETCH_ERROR,
      caughtError,
    );
  }
  return null;
}

/*
 * Given a colony address, dispatch actions to fetch all tasks
 * for that colony.
 */
function* colonyTaskMetadataFetch({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_TASK_METADATA_FETCH>) {
  try {
    const colonyTasks = yield executeQuery(getColonyTasks, {
      args: undefined,
      metadata: { colonyAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.COLONY_TASK_METADATA_FETCH_SUCCESS,
      meta: { key: colonyAddress },
      payload: { colonyAddress, colonyTasks },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_TASK_METADATA_FETCH_ERROR,
      error,
      meta,
    );
  }
  return null;
}

function* colonyCanMintNativeTokenFetch({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH>) {
  try {
    const canMintNativeToken = yield executeQuery(getColonyCanMintNativeToken, {
      args: undefined,
      metadata: { colonyAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_SUCCESS,
      meta,
      payload: { canMintNativeToken, colonyAddress },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_ERROR,
      error,
      meta,
    );
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

    yield put(fetchColony(colonyAddress));
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

function* colonySubStart({ payload: { colonyAddress }, meta }: any) {
  // @TODO: Generalize subscription sagas
  // @BODY This could be generalised (it's very similar to the above function),
  // but it's probably worth waiting to see, as this pattern will likely change
  // as it gets used elsewhere.
  let channel;
  try {
    channel = yield call(executeSubscription, subscribeToColony, {
      metadata: { colonyAddress },
    });

    yield fork(function* stopSubscription() {
      yield take(
        action =>
          action.type === ActionTypes.COLONY_SUB_STOP &&
          action.payload.colonyAddress === colonyAddress,
      );
      channel.close();
    });

    const reduceTokenToDispatch = (acc, token) =>
      token.balance === undefined
        ? [
            ...acc,
            put(fetchColonyTokenBalances(colonyAddress, token.address)),
            put(fetchToken(token.address)),
          ]
        : acc;

    while (true) {
      const colony = yield take(channel);
      yield put({
        type: ActionTypes.COLONY_SUB_EVENTS,
        meta,
        payload: {
          colonyAddress,
          colony,
        },
      });

      // select the freshly updated colony
      const { record: colonyFromState } = yield select(
        colonySelector,
        colonyAddress,
      );

      // fetch canMintNativeToken if we didn't already
      if (colonyFromState.canMintNativeToken === undefined) {
        yield put(fetchColonyCanMintNativeToken(colonyAddress));
      }

      // fetch colony domains for token balances
      yield put<AllActions>(fetchDomains(colonyAddress));

      // fetch token balances for those which we have loaded
      if (colonyFromState.tokens) {
        yield all(
          colonyFromState.tokens.toList().reduce(reduceTokenToDispatch, []),
        );
      }
    }
  } catch (caughtError) {
    return yield putError(ActionTypes.COLONY_SUB_ERROR, caughtError, meta);
  } finally {
    if (channel && typeof channel.close === 'function') {
      channel.close();
    }
  }
}

function* colonyTaskMetadataSubStart({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_TASK_METADATA_SUB_START>) {
  let channel;
  try {
    channel = yield call(executeSubscription, subscribeToColonyTasks, {
      metadata: { colonyAddress },
    });

    yield fork(function* stopSubscription() {
      yield take(
        action =>
          action.type === ActionTypes.COLONY_TASK_METADATA_SUB_STOP &&
          action.payload.colonyAddress === colonyAddress,
      );
      channel.close();
    });

    while (true) {
      const colonyTasks = yield take(channel);
      yield put({
        type: ActionTypes.COLONY_TASK_METADATA_SUB_EVENTS,
        meta,
        payload: {
          colonyAddress,
          colonyTasks,
        },
      });
    }
  } catch (caughtError) {
    return yield putError(
      ActionTypes.COLONY_TASK_METADATA_SUB_ERROR,
      caughtError,
      meta,
    );
  } finally {
    if (channel && typeof channel.close == 'function') {
      channel.close();
    }
  }
}

export default function* colonySagas() {
  yield takeEvery(ActionTypes.COLONY_ADDRESS_FETCH, colonyAddressFetch);
  yield takeEvery(
    ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH,
    colonyCanMintNativeTokenFetch,
  );
  yield takeEvery(ActionTypes.COLONY_FETCH, colonyFetch);
  yield takeEvery(ActionTypes.COLONY_NAME_FETCH, colonyNameFetch);
  yield takeEvery(
    ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK,
    colonyNativeTokenUnlock,
  );
  yield takeEvery(
    ActionTypes.COLONY_RECOVERY_MODE_ENTER,
    colonyRecoveryModeEnter,
  );
  yield takeEvery(
    ActionTypes.COLONY_TASK_METADATA_FETCH,
    colonyTaskMetadataFetch,
  );
  yield takeEvery(
    ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
    colonyTokenBalanceFetch,
  );
  yield takeEvery(
    ActionTypes.COLONY_TOKEN_BALANCES_FETCH,
    colonyTokenBalancesFetch,
  );
  yield takeEvery(ActionTypes.COLONY_VERSION_UPGRADE, colonyUpgradeContract);
  yield takeEvery(ActionTypes.COLONY_SUB_START, colonySubStart);
  yield takeEvery(
    ActionTypes.COLONY_TASK_METADATA_SUB_START,
    colonyTaskMetadataSubStart,
  );

  /*
   * Note that the following actions use `takeLatest` because they are
   * dispatched on user keyboard input and use the `delay` saga helper.
   */
  yield takeLatest(ActionTypes.COLONY_AVATAR_REMOVE, colonyAvatarRemove);
  yield takeLatest(ActionTypes.COLONY_AVATAR_UPLOAD, colonyAvatarUpload);
  yield takeLatest(
    ActionTypes.COLONY_NAME_CHECK_AVAILABILITY,
    colonyNameCheckAvailability,
  );
}
