/* @flow */

import { call, put, takeEvery } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import { CREATE_TOKEN, CREATE_COLONY } from '../actionTypes';
import { LOAD_NETWORK } from '../../core/actionTypes';

import networkContext from '~context/network';

function* createToken(action: Object): Saga<*> {
  const { name, symbol } = action.payload;
  const { setErrors, setSubmitting, handleTokenCreated } = action;

  setSubmitting(true);
  yield put.resolve({ type: LOAD_NETWORK });

  try {
    const tokenAddress = yield call(networkContext.instance.createToken, {
      name,
      symbol,
    });
    setSubmitting(false);
    handleTokenCreated(tokenAddress);
  } catch (error) {
    setSubmitting(false);
    setErrors('Could not create Token'); // TODO: actual error with intl
  }
}

function* createColony(action: Object): Saga<*> {
  const { tokenAddress } = action.payload;
  const { setErrors, setSubmitting, handleColonyCreated } = action;

  setSubmitting(true);
  yield put.resolve({ type: LOAD_NETWORK });

  try {
    const {
      eventData: { colonyId, colonyAddress },
    } = yield call(networkContext.instance.createColony.send, { tokenAddress });
    setSubmitting(false);
    handleColonyCreated(colonyId, colonyAddress);
  } catch (error) {
    setSubmitting(false);
    setErrors('Could not create Colony'); // TODO: actual error with intl
  }
}

export default function* colony(): any {
  yield takeEvery(CREATE_TOKEN, createToken);
  yield takeEvery(CREATE_COLONY, createColony);
}
