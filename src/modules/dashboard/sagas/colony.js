/* @flow */

import type { Saga } from 'redux-saga';

import { call, takeEvery, getContext, put } from 'redux-saga/effects';

import { CREATE_COLONY, CREATE_TOKEN } from '../actionTypes';
import {
  createColonyError,
  createColonySuccess,
  createTokenError,
  createTokenSuccess,
} from '../actionCreators';

function* createToken({ payload: { name, symbol } }: Object): Saga<*> {
  try {
    const { instance: networkClient } = yield getContext('networkClient');

    const address = yield call([networkClient, networkClient.createToken], {
      name,
      symbol,
    });
    yield put(createTokenSuccess(name, symbol, address));
  } catch (error) {
    yield put(createTokenError(error));
  }
}

function* createColony({ tokenAddress }: Object): Saga<*> {
  try {
    const { instance: networkClient } = yield getContext('networkClient');

    const {
      eventData: { colonyId, colonyAddress },
    } = yield call([networkClient, networkClient.createColony.send], {
      tokenAddress,
    });
    yield put(createColonySuccess(colonyId, colonyAddress));
  } catch (error) {
    yield put(createColonyError(error));
  }
}

export default function* colony(): any {
  yield takeEvery(CREATE_TOKEN, createToken);
  yield takeEvery(CREATE_COLONY, createColony);
}
