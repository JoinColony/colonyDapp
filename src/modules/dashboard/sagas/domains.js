/* @flow */

import type { Saga } from 'redux-saga';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~redux';

import {
  putError,
  takeFrom,
  executeQuery,
  executeCommand,
  // putNotification,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';

// import { getContext, CONTEXT } from '~context';
// import { decorateLog } from '~utils/web3/eventLogs/events';
// import { normalizeTransactionLog } from '~data/normalizers';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';
import { createDomain, editDomain } from '../data/commands';
import { getColonyDomains } from '../data/queries';

function* colonyDomainsFetch({
  meta,
  payload: { colonyAddress },
}: Action<typeof ACTIONS.COLONY_DOMAINS_FETCH>): Saga<*> {
  try {
    const domains = yield* executeQuery(getColonyDomains, {
      metadata: { colonyAddress },
    });
    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        domains,
      },
    });
  } catch (error) {
    return yield putError(ACTIONS.COLONY_DOMAINS_FETCH_ERROR, error, meta);
  }
  return null;
}

function* domainCreate({
  payload: { colonyAddress, domainName: name, parentDomainId = 1 },
  meta,
}: Action<typeof ACTIONS.DOMAIN_CREATE>): Saga<*> {
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
        eventData: { domainId: id },
        // transaction: {
        //   receipt: {
        //     logs: [, domainAddedLog],
        //   },
        // },
      },
    } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Add an entry to the colony store.
     */
    yield* executeCommand(createDomain, {
      metadata: { colonyAddress },
      args: {
        domainId: id,
        name,
      },
    });
    /*
     * Dispatch a success action with the newly-added domain.
     */
    yield put<Action<typeof ACTIONS.DOMAIN_CREATE_SUCCESS>>({
      type: ACTIONS.DOMAIN_CREATE_SUCCESS,
      meta,
      payload: { colonyAddress, domain: { id, name } },
    });

    // const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
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
    return yield putError(ACTIONS.DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

function* domainEdit({
  payload: { colonyAddress, domainName: name, parentDomainId = 1, domainId },
  meta,
}: Action<typeof ACTIONS.DOMAIN_EDIT>): Saga<*> {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'editDomain',
      identifier: colonyAddress,
      params: { parentDomainId, domainId },
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Add an entry to the colony store.
     * Get the domain ID from the payload
     */
    yield* executeCommand(editDomain, {
      metadata: { colonyAddress },
      args: {
        domainId,
        name,
      },
    });
    /*
     * Dispatch a success action with the newly-added domain.
     */
    yield put<Action<typeof ACTIONS.DOMAIN_EDIT_SUCCESS>>({
      type: ACTIONS.DOMAIN_EDIT_SUCCESS,
      meta,
      payload: { colonyAddress, domain: { id: domainId, name } },
    });
  } catch (error) {
    return yield putError(ACTIONS.DOMAIN_EDIT_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* domainSagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_DOMAINS_FETCH, colonyDomainsFetch);
  yield takeEvery(ACTIONS.DOMAIN_CREATE, domainCreate);
  yield takeEvery(ACTIONS.DOMAIN_EDIT, domainEdit);
}
