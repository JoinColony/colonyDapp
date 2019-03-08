/* @flow */

import type { Saga } from 'redux-saga';

import { call, put } from 'redux-saga/effects';

import type { NetworkProps } from '~immutable';

import { CONTEXT, getContext } from '~context';

import { updateNetworkVersion } from '../../actionCreators';

export default function* getNetworkVersion(): Saga<NetworkProps> {
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);

  const { version: networkVersion } = yield call([
    colonyManager.networkClient.getCurrentColonyVersion,
    colonyManager.networkClient.getCurrentColonyVersion.call,
  ]);

  yield put(updateNetworkVersion(networkVersion));

  return networkVersion;
}
