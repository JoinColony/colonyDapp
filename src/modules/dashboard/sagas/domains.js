/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~redux';
import type { Address } from '~types';

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

import { createDomain } from '../data/commands';
import { getColonyDomains } from '../data/queries';

import { fetchDomains } from '../actionCreators';

import { getColonyContext } from './shared';

function* colonyDomainsFetch({
  meta,
  payload: { colonyAddress },
}: Action<typeof ACTIONS.COLONY_DOMAINS_FETCH>): Saga<void> {
  try {
    const context = yield* getColonyContext(colonyAddress);
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
  payload: { colonyAddress, domainName, parentDomainId = 1 },
  meta,
}: Action<typeof ACTIONS.DOMAIN_CREATE>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const context = yield* getColonyContext(colonyAddress);
    /*
     * Create the domain on the colony with a transaction.
     * TODO idempotency could be improved here by looking for a pending transaction.
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
        keyPath: [colonyAddress, domainId],
      },
      payload: { id: domainId, name: domainName },
    });

    yield put(fetchDomains(colonyAddress));
  } catch (error) {
    yield putError(ACTIONS.DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

function* checkDomainExists(
  colonyAddress: Address,
  domainId: number,
): Saga<void> {
  const getDomainCount = yield call(
    getColonyMethod,
    'getDomainCount',
    colonyAddress,
  );
  const { count } = yield call(getDomainCount);

  if (domainId > count)
    throw new Error(
      `Domain ID "${domainId}" does not exist on colony "${colonyAddress}"`,
    );
}

/*
 * Fetch the domain for the given colony ENS name and domain ID.
 */
function* domainFetch({
  meta,
  payload: { colonyAddress, domainId },
}: Action<typeof ACTIONS.DOMAIN_FETCH>): Saga<void> {
  try {
    yield call(checkDomainExists, colonyAddress, domainId);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.DOMAIN_FETCH_SUCCESS>>({
      type: ACTIONS.DOMAIN_FETCH_SUCCESS,
      meta,
      // TODO this ain't doing a whole lot.
      payload: { id: domainId, name: '' },
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
