import ApolloClient from 'apollo-client';
import {
  all,
  call,
  delay,
  fork,
  put,
  takeEvery,
  takeLatest,
  select,
} from 'redux-saga/effects';
import BigNumber from 'bn.js';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import {
  putError,
  takeFrom,
  executeQuery,
  selectAsJS,
} from '~utils/saga/effects';
import { ColonyType, ColonyRolesType } from '~immutable/index';
import { ColonyManager, ContractContexts, createAddress } from '~types/index';
import {
  ColonyDocument,
  ColonyQueryResult,
  EditColonyProfileDocument,
} from '~data/index';
import { getContext, Context } from '~context/index';

import { checkColonyNameIsAvailable } from '../data/queries';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';
import { networkVersionSelector } from '../../core/selectors';
import {
  fetchColony,
  fetchDomains,
  fetchToken,
  fetchColonyTokenBalance,
  fetchColonyTokenBalances,
} from '../actionCreators';
import { colonyDomainsSelector } from '../selectors';
import { getColonyAddress, getColonyName } from './shared';

function* getBalanceForTokenAndDomain(colonyAddress, tokenAddress, domainId) {
  const colonyManager: ColonyManager = yield getContext(Context.COLONY_MANAGER);
  const colonyClient = yield colonyManager.getColonyClient(colonyAddress);

  const { potId } = yield colonyClient.getDomain.call({ domainId });
  const {
    balance: rewardsPotTotal,
  } = yield colonyClient.getFundingPotBalance.call({
    potId,
    token: tokenAddress,
  });
  if (domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
    const {
      total: nonRewardsPotsTotal,
    } = yield colonyClient.getNonRewardPotsTotal.call({
      token: tokenAddress,
    });
    return new BigNumber(nonRewardsPotsTotal.add(rewardsPotTotal).toString(10));
  }
  return new BigNumber(rewardsPotTotal.toString(10));
}

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
    const colonyManager: ColonyManager = yield getContext(
      Context.COLONY_MANAGER,
    );
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const colonyClient = yield colonyManager.getColonyClient(colonyAddress);

    const { inRecoveryMode } = yield colonyClient.isInRecoveryMode.call();
    const { version } = yield colonyClient.getVersion.call();

    // wrap this in a try/catch since it will fail if token doesn't support locking
    let isNativeTokenLocked;
    try {
      const { locked } = yield colonyClient.tokenClient.isLocked.call();
      isNativeTokenLocked = locked;
    } catch (error) {
      isNativeTokenLocked = false;
    }

    // wrap this in a try/catch since it will fail if token can't be unlocked
    let canUnlockNativeToken;
    try {
      yield colonyClient.tokenClient.unlock.call({});
      canUnlockNativeToken = isNativeTokenLocked;
    } catch (error) {
      canUnlockNativeToken = false;
    }

    // fetch whether the user is allowed to mint tokens via the colony
    let canMintNativeToken = true;
    try {
      yield colonyClient.mintTokens.estimate({ amount: new BigNumber(1) });
    } catch (error) {
      canMintNativeToken = false;
    }

    const { data }: ColonyQueryResult = yield apolloClient.query({
      query: ColonyDocument,
      variables: { address: colonyAddress },
    });

    if (!data) throw new Error('Could not get colony metadata');

    const {
      avatarHash,
      colonyName,
      displayName,
      guideline,
      id,
      tokens,
      website,
    } = data.colony;

    const tokensWithEth = [{ address: ZERO_ADDRESS }, ...tokens];

    const tokenBalances = yield all(
      tokensWithEth.map(({ address }) =>
        call(
          getBalanceForTokenAndDomain,
          colonyAddress,
          address,
          COLONY_TOTAL_BALANCE_DOMAIN_ID,
        ),
      ),
    );

    const tokenMap = tokensWithEth.reduce((acc, { address, ...token }, idx) => {
      acc[address] = {
        address,
        balances: { [COLONY_TOTAL_BALANCE_DOMAIN_ID]: tokenBalances[idx] },
        ...token,
      };
      return acc;
    }, {});

    const colony: ColonyType = {
      avatarHash: avatarHash || undefined,
      canMintNativeToken,
      canUnlockNativeToken,
      colonyAddress,
      colonyName,
      displayName: displayName || undefined,
      guideline: guideline || undefined,
      id,
      inRecoveryMode,
      isNativeTokenLocked,
      tokens: tokenMap,
      version,
      website: website || undefined,
    };

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
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    yield apolloClient.mutate({
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
    const balance = yield call(
      getBalanceForTokenAndDomain,
      colonyAddress,
      tokenAddress,
      domainId,
    );

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

export default function* colonySagas() {
  yield takeEvery(ActionTypes.COLONY_ADDRESS_FETCH, colonyAddressFetch);
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
    ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
    colonyTokenBalanceFetch,
  );
  yield takeEvery(
    ActionTypes.COLONY_TOKEN_BALANCES_FETCH,
    colonyTokenBalancesFetch,
  );
  yield takeEvery(ActionTypes.COLONY_VERSION_UPGRADE, colonyUpgradeContract);

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
