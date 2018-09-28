/* @flow */

import { call, put, takeEvery } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import { CREATE_TOKEN, CREATE_COLONY } from '../actionTypes';

import { tokenCreated, colonyCreated } from '../actionCreators/colony';

import colonyNetwork from '~utils/colonyNetwork';

function* createToken({
  payload: { name, symbol },
}: {
  payload: { name: String, symbol: String },
}): Saga<*> {
  const network = yield call(colonyNetwork);
  const tokenAddress = yield call(network.createToken, { name, symbol });
  yield put(tokenCreated(name, symbol, tokenAddress));
}

function* createColony({
  payload: { tokenAddress },
}: {
  payload: {
    tokenAddress: String,
  },
}): Saga<*> {
  const network = yield call(colonyNetwork);
  const {
    eventData: { colonyId, colonyAddress },
  } = yield call(network.createColony.send, { tokenAddress });
  yield put(colonyCreated(colonyId, colonyAddress));
}

export default function* colony(): any {
  yield takeEvery(CREATE_TOKEN, createToken);
  yield takeEvery(CREATE_COLONY, createColony);
}
