/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';

import { CONTEXT, getContext } from '~context';

import type { Address, ENSName } from '~types';

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
