/* @flow */

import type { Saga } from 'redux-saga';
import { call, fork, put, takeEvery, select } from 'redux-saga/effects';

import type { Action } from '~redux';

import {
  putError,
  takeFrom,
  executeQuery,
  executeCommand,
  putNotification,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';
import { walletAddressSelector } from '../../users/selectors';

import { createDomain } from '../data/commands';
import { getColonyDomains } from '../data/queries';

import { NOTIFICATION_EVENT_DOMAIN_ADDED } from '~users/Inbox/events';

function* colonyDomainsFetch({
  meta,
  payload: { colonyAddress },
}: Action<typeof ACTIONS.COLONY_DOMAINS_FETCH>): Saga<void> {
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
    yield putError(ACTIONS.COLONY_DOMAINS_FETCH_ERROR, error, meta);
  }
}

function* domainCreate({
  payload: { colonyAddress, domainName: name, parentDomainId = 1 },
  meta,
}: Action<typeof ACTIONS.DOMAIN_CREATE>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    /*
     * Get the current user's wallet address (we need that for notifications)
     */
    const walletAddress = yield select(walletAddressSelector);
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

    /*
     * Notification
     */
    yield putNotification({
      colonyAddress,
      domainName: name,
      event: NOTIFICATION_EVENT_DOMAIN_ADDED,
      sourceUserAddress: walletAddress,
    });
  } catch (error) {
    yield putError(ACTIONS.DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* domainSagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_DOMAINS_FETCH, colonyDomainsFetch);
  yield takeEvery(ACTIONS.DOMAIN_CREATE, domainCreate);
}
