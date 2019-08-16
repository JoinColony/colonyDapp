/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';

import { CONTEXT, getContext } from '~context';

import type { Address, ENSName } from '~types';

export function* getColonyAddress(colonyName: ENSName): Saga<?string> {
  const ens = yield* getContext(CONTEXT.ENS_INSTANCE);
  const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);

  return yield call(
    [ens, ens.getAddress],
    ens.constructor.getFullDomain('colony', colonyName),
    networkClient,
  );
}

export function* getColonyName(colonyAddress: Address): Saga<?string> {
  const ens = yield* getContext(CONTEXT.ENS_INSTANCE);
  const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);

  const domain = yield call([ens, ens.getDomain], colonyAddress, networkClient);
  return ens.constructor.stripDomainParts('colony', domain);
}
