import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux/index';
import {
  putError,
  takeFrom,
  executeQuery,
  executeCommand,
} from '~utils/saga/effects';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';
import { createDomain, editDomain } from '../data/commands';
import { getDomain, getColonyDomains } from '../data/queries';

function* colonyDomainsFetch({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_DOMAINS_FETCH>) {
  try {
    const domains = yield executeQuery(getColonyDomains, {
      metadata: { colonyAddress },
    });

    /*
     * Dispatch the success action.
     */
    yield put<AllActions>({
      type: ActionTypes.COLONY_DOMAINS_FETCH_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        domains,
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_DOMAINS_FETCH_ERROR, error, meta);
  }
  return null;
}

function* domainCreate({
  payload: { colonyAddress, domainName: name, parentDomainId = 1 },
  meta,
}: Action<ActionTypes.DOMAIN_CREATE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    /*
     * @todo Create the domain on the colony with a transaction.
     * @body Idempotency could be improved here by looking for a pending transaction.
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'addDomain',
      identifier: colonyAddress,
      params: { parentDomainId },
    });

    /*
     * Get the new domain ID from the successful transaction.
     */
    const {
      payload: {
        eventData: { domainId: id }, // transaction: {
        //   receipt: {
        //     logs: [, domainAddedLog],
        //   },
        // },
      },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    /*
     * Add an entry to the colony store.
     */
    yield executeCommand(createDomain, {
      metadata: { colonyAddress },
      args: {
        domainId: id,
        name,
      },
    });

    /*
     * Dispatch a success action with the newly-added domain.
     */
    yield put<AllActions>({
      type: ActionTypes.DOMAIN_CREATE_SUCCESS,
      meta,
      // For now parentId is just root domain
      payload: { colonyAddress, domain: { id, name, parentId: 1 } },
    });

    // const colonyManager = yield getContext(Context.COLONY_MANAGER);
    // const colonyClient = yield call(
    //   [colonyManager, colonyManager.getColonyClient],
    //   colonyAddress,
    // );

    /*
     * Notification
     */

    // const decoratedLog = yield call(decorateLog, colonyClient, domainAddedLog);
    // yield putNotification(normalizeTransactionLog(colonyAddress, decoratedLog));
  } catch (error) {
    return yield putError(ActionTypes.DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

function* domainEdit({
  payload: { colonyAddress, domainName, domainId },
  meta,
}: Action<ActionTypes.DOMAIN_EDIT>) {
  try {
    /*
     * Add an entry to the colony store.
     * Get the domain ID from the payload
     */
    yield executeCommand(editDomain, {
      metadata: { colonyAddress },
      args: {
        domainId,
        name: domainName,
      },
    });
    /*
     * Dispatch a success action with the newly-edited domain.
     */
    yield put<AllActions>({
      type: ActionTypes.DOMAIN_EDIT_SUCCESS,
      meta,
      // For now parentId is just root domain
      payload: { colonyAddress, domainId, domainName, parentId: 1 },
    });
  } catch (error) {
    return yield putError(ActionTypes.DOMAIN_EDIT_ERROR, error, meta);
  }
  return null;
}

function* moveFundsBetweenPots({
  payload: { colonyAddress, fromDomain, toDomain, amount, tokenAddress },
  meta,
}: Action<ActionTypes.MOVE_FUNDS_BETWEEN_POTS>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    const [{ potId: fromPot }, { potId: toPot }] = yield all([
      executeQuery(getDomain, {
        args: { domainId: fromDomain },
        metadata: { colonyAddress },
      }),
      executeQuery(getDomain, {
        args: { domainId: toDomain },
        metadata: { colonyAddress },
      }),
    ]);

    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'moveFundsBetweenPots',
      identifier: colonyAddress,
      params: { token: tokenAddress, fromPot, toPot, amount },
    });

    // Replace with TRANSACTION_CREATED if
    // you want the saga to be done as soon as the tx is created
    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.MOVE_FUNDS_BETWEEN_POTS_SUCCESS,
      payload: { colonyAddress, tokenAddress, fromPot, toPot, amount },
      meta,
    });
  } catch (caughtError) {
    putError(ActionTypes.MOVE_FUNDS_BETWEEN_POTS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* domainSagas() {
  yield takeEvery(ActionTypes.COLONY_DOMAINS_FETCH, colonyDomainsFetch);
  yield takeEvery(ActionTypes.DOMAIN_CREATE, domainCreate);
  yield takeEvery(ActionTypes.DOMAIN_EDIT, domainEdit);
  yield takeEvery(ActionTypes.MOVE_FUNDS_BETWEEN_POTS, moveFundsBetweenPots);
}
