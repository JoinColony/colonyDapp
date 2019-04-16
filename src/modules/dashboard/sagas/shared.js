/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';

import { CONTEXT, getContext } from '~context';

import type { Address, ENSName } from '~types';

// eslint-disable-next-line import/prefer-default-export
export function* getColonyContext(colonyAddress: Address): Saga<*> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);

  if (!colonyManager)
    throw new Error('Cannot get colony context. Invalid manager instance');

  const colonyClient = yield call(
    [colonyManager, colonyManager.getColonyClient],
    colonyAddress,
  );

  return {
    ddb,
    colonyClient,
    wallet,
    metadata: {
      colonyAddress,
    },
  };
}

export function* getColonyAddress(colonyName: ENSName): Saga<?string> {
  const ensCache = yield* getContext(CONTEXT.ENS_INSTANCE);
  const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);

  return yield call(
    [ensCache, ensCache.getAddress],
    ensCache.constructor.getFullDomain('colony', colonyName),
    networkClient,
  );
}

export function* getColonyName(colonyAddress: Address): Saga<?string> {
  const ensCache = yield* getContext(CONTEXT.ENS_INSTANCE);
  const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);

  const domain = yield call(
    [ensCache, ensCache.getDomain],
    colonyAddress,
    networkClient,
  );
  const [colonyName] = domain.split('.');
  return colonyName;
}
