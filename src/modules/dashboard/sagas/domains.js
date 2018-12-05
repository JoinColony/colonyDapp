/* @flow */

import type { Saga } from 'redux-saga';

import { put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';

import { callCaller, putError } from '~utils/saga/effects';

import {
  ROOT_DOMAIN_FETCH,
  ROOT_DOMAIN_FETCH_ERROR,
  ROOT_DOMAIN_FETCH_SUCCESS,
} from '../actionTypes';

function* getRootDomain(action: Action): Saga<void> {
  const { colonyIdentifier } = action.payload;
  try {
    const result = yield callCaller({
      methodName: 'getDomain',
      colonyIdentifier,
      params: { domainId: 1 },
    });
    yield put({ type: ROOT_DOMAIN_FETCH_SUCCESS, payload: result });
  } catch (error) {
    yield putError(ROOT_DOMAIN_FETCH_ERROR, error);
  }
}

export default function* domainSagas(): any {
  yield takeEvery(ROOT_DOMAIN_FETCH, getRootDomain);
}
