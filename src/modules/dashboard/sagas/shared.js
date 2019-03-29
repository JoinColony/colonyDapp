/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';

import { CONTEXT, getContext } from '~context';

// eslint-disable-next-line import/prefer-default-export
export function* getColonyContext(
  colonyENSName: ?string,
  colonyAddress: ?string,
): Saga<Object> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
  if (!colonyManager)
    throw new Error('Cannot get colony context. Invalid manager instance');
  const identifier = colonyENSName || colonyAddress;
  if (!identifier)
    throw new Error('Cannot get colony context. Invalid identifier');
  const colonyClient = yield call(
    [colonyManager, colonyManager.getColonyClient],
    identifier,
  );
  return {
    ddb,
    colonyClient,
    wallet,
    metadata: {
      colonyENSName,
      colonyAddress: colonyClient.contract.address,
    },
  };
}
