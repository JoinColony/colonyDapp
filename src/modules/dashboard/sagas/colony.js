/* @flow */

import { call, put, takeEvery, take } from 'redux-saga/effects';
import { defineMessages } from 'react-intl';

import type { Saga } from 'redux-saga';
import { CREATE_TOKEN, CREATE_COLONY } from '../actionTypes';
import {
  LOAD_COLONY_NETWORK,
  COLONY_NETWORK_LOADED,
} from '../../core/actionTypes';

export const MSG = defineMessages({
  errorCreateToken: {
    id: 'error.colony.createToken',
    defaultMessage: 'Could not create Token',
  },
  errorCreateColony: {
    id: 'error.colony.createColony',
    defaultMessage: 'Could not create Colony',
  },
});

function* createToken(action: Object): Saga<*> {
  const { name, symbol } = action.payload;
  const { setErrors, setSubmitting, handleTokenCreated } = action;

  setSubmitting(true);
  yield put({ type: LOAD_COLONY_NETWORK });
  const { networkClient } = yield take(COLONY_NETWORK_LOADED);

  try {
    const tokenAddress = yield call(
      [networkClient, networkClient.createToken],
      {
        name,
        symbol,
      },
    );
    setSubmitting(false);
    handleTokenCreated(tokenAddress);
  } catch (error) {
    setSubmitting(false);
    setErrors(MSG.errorCreateToken);
  }
}

function* createColony(action: Object): Saga<*> {
  const { tokenAddress } = action.payload;
  const { setErrors, setSubmitting, handleColonyCreated } = action;

  setSubmitting(true);
  yield put({ type: LOAD_COLONY_NETWORK });
  const { networkClient } = yield take(COLONY_NETWORK_LOADED);

  try {
    const {
      eventData: { colonyId, colonyAddress },
    } = yield call([networkClient, networkClient.createColony.send], {
      tokenAddress,
    });
    setSubmitting(false);
    handleColonyCreated(colonyId, colonyAddress);
  } catch (error) {
    setSubmitting(false);
    setErrors(MSG.errorCreateColony);
  }
}

export default function* colony(): any {
  yield takeEvery(CREATE_TOKEN, createToken);
  yield takeEvery(CREATE_COLONY, createColony);
}
