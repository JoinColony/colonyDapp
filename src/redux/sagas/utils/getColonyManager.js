/* @flow */

import { call } from 'redux-saga/effects';

import { create } from '../../../utils/saga/effects';

import ColonyManager from '../../../lib/ColonyManager';

import getNetworkClient from './getNetworkClient';

/*
 * Return an initialized ColonyManager instance.
 */
export default function* getColonyManager(): Generator<*, ColonyManager, *> {
  const networkClient = yield call(getNetworkClient);

  const colonyManager: ColonyManager = yield create(
    ColonyManager,
    networkClient,
  );
  return colonyManager;
}
