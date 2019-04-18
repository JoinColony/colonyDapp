/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';

import { create } from '~utils/saga/effects';

import ColonyManager from '../../../../lib/ColonyManager';

import getNetworkClient from './getNetworkClient';

/*
 * Return an initialized ColonyManager instance.
 */
export default function* getColonyManager(): Saga<ColonyManager> {
  const networkClient = yield call(getNetworkClient);
  return yield create(ColonyManager, networkClient);
}
