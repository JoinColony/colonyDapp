/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, select, takeEvery } from 'redux-saga/effects';

import type { Action } from '~redux';
import type { ENSName } from '~types';

import {
  putError,
  takeFrom,
  executeQuery,
  executeCommand,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { getColonyMethod } from '../../core/sagas/utils';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';

import { createDomain } from '../../../data/service/commands';
import { getColonyDomains } from '../../../data/service/queries';

import { domainSelector } from '../selectors';

import { getColonyContext } from './shared';

function* colonyDomainsFetch({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: Action<typeof ACTIONS.COLONY_DOMAINS_FETCH>): Saga<void> {
  try {
    const context = yield* getColonyContext(colonyENSName);
    const domains = yield* executeQuery(context, getColonyDomains);
    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS,
      meta,
      payload: domains,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_DOMAINS_FETCH_ERROR, error, meta);
  }
}

function* domainCreate({
  payload: { domainName, parentDomainId = 1 },
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: Action<typeof ACTIONS.DOMAIN_CREATE>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const context = yield* getColonyContext(colonyENSName);
    /*
     * Create the domain on the colony with a transaction.
     * TODO idempotency could be improved here by looking for a pending transaction.
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'addDomain',
      identifier: colonyENSName,
      params: { parentDomainId },
    });

    /*
     * Get the new domain ID from the successful transaction.
     */
    const {
      payload: {
        eventData: { domainId },
      },
    } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Add an entry to the colony store.
     */
    yield* executeCommand(context, createDomain, {
      domainId,
      name: domainName,
    });
    /*
     * Dispatch a success action with the newly-added domain.
     */
    yield put<Action<typeof ACTIONS.DOMAIN_CREATE_SUCCESS>>({
      type: ACTIONS.DOMAIN_CREATE_SUCCESS,
      meta: {
        ...meta,
        keyPath: [colonyENSName, domainId],
      },
      payload: { id: domainId, name: domainName },
    });
  } catch (error) {
    yield putError(ACTIONS.DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

function* checkDomainExists(
  colonyENSName: ENSName,
  domainId: number,
): Saga<void> {
  const getDomainCount = yield call(
    getColonyMethod,
    'getDomainCount',
    colonyENSName,
  );
  const { count } = yield call(getDomainCount);

  if (domainId > count)
    throw new Error(
      `Domain ID "${domainId}" does not exist on colony "${colonyENSName}"`,
    );
}

// TODO: We can just use the state directly from the colony we fetch
/*
 * Fetch the domain for the given colony ENS name and domain ID.
 */
function* domainFetch({
  meta: {
    keyPath: [colonyENSName, domainId],
  },
  meta,
}: Action<typeof ACTIONS.DOMAIN_FETCH>): Saga<void> {
  try {
    yield call(checkDomainExists, colonyENSName, domainId);
    const domain = yield select(domainSelector, domainId);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.DOMAIN_FETCH_SUCCESS>>({
      type: ACTIONS.DOMAIN_FETCH_SUCCESS,
      meta,
      payload: domain,
    });
  } catch (error) {
    yield putError(ACTIONS.DOMAIN_FETCH_ERROR, error, meta);
  }
}

export default function* domainSagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_DOMAINS_FETCH, colonyDomainsFetch);
  yield takeEvery(ACTIONS.DOMAIN_CREATE, domainCreate);
  yield takeEvery(ACTIONS.DOMAIN_FETCH, domainFetch);
}
