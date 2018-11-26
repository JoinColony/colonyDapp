/* @flow */

import type { BigNumber } from 'bn.js';

import { call, getContext } from 'redux-saga/effects';

export default function* getGasPrice(): Generator<*, BigNumber, *> {
  const colonyManager = yield getContext('colonyManager');

  return yield call([
    colonyManager.networkClient.adapter.provider,
    colonyManager.networkClient.adapter.provider.getGasPrice,
  ]);
}
