/* @flow */

import type { Saga } from 'redux-saga';

import {
  call,
  getContext,
  put,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';

import type { Action, AddressOrENSName, ENSName } from '~types';

import { putError } from '~utils/saga/effects';

import { walletAddressSelector } from 'modules/users/selectors';
import {
  DOMAIN_CREATE,
  DOMAIN_CREATE_ERROR,
  DOMAIN_CREATE_SUCCESS,
  DOMAIN_FETCH,
  DOMAIN_FETCH_ERROR,
  DOMAIN_FETCH_SUCCESS,
} from '../actionTypes';

import { execute } from '../../../data/execution';
import { createDomain } from '../../../data/service/commands/domains';
import { getDomainStore } from '../../../data/service/queries/domains';

function* fetchDomainSaga({
  meta,
  meta: {
    keyPath: [colonyENSName, domainId],
  },
}: Action): Saga<void> {
  try {
    // Get any context needed
    const ddb = yield getContext('ddb');
    const walletAddress = yield select(walletAddressSelector);

    const domainsStore = yield call(getDomainStore, {
      ddb,
      colonyENSName,
      domainId,
      walletAddress,
    });

    // Just an example
    const payload = yield call(getDomainById, { domainsStore, domainId });

    yield put({
      type: DOMAIN_FETCH_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(DOMAIN_FETCH_ERROR, error, meta);
  }
}

function* createDomainSaga({
  payload: { colonyENSName, domainName },
  payload,
  meta,
}: Action): Saga<void> {
  try {
    // Get any context needed
    const ddb = yield getContext('ddb');
    const walletAddress = yield select(walletAddressSelector);

    // const response = yield call(myAPI, my args);

    // 1. Thiago's preferred store designs (includes saga surgery) - includes permissions?
    // 2. Introduce commands when we introduce new features (leave old stuff as is)
    // 3. Move the old sagas to the new format (major saga surgery)

    // Send a transaction as per usual
    const domainId = yield call(createDomainTransaction, {
      colonyENSName,
      domainName,
    });

    // Command!
    yield execute(
      createDomain,
      { ddb },
      { walletAddress, colonyENSName, domainId },
    );

    // Done!
    yield put({
      type: DOMAIN_CREATE_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    yield putError(DOMAIN_CREATE_ERROR, error, meta);
  }
}

export default function* domainSagas(): any {
  yield takeEvery(DOMAIN_CREATE, createDomainSaga);
  yield takeEvery(DOMAIN_FETCH, fetchDomainSaga);
}
