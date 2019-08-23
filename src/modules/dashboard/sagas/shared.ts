import { call } from 'redux-saga/effects';

import { Context, getContext } from '~context/index';
import { Address, ENSName } from '~types/index';

export function* getColonyAddress(colonyName: ENSName) {
  const ens = yield getContext(Context.ENS_INSTANCE);
  const { networkClient } = yield getContext(Context.COLONY_MANAGER);

  return yield call(
    [ens, ens.getAddress],
    ens.constructor.getFullDomain('colony', colonyName),
    networkClient,
  );
}

export function* getColonyName(colonyAddress: Address) {
  const ens = yield getContext(Context.ENS_INSTANCE);
  const { networkClient } = yield getContext(Context.COLONY_MANAGER);

  const domain = yield call([ens, ens.getDomain], colonyAddress, networkClient);
  return ens.constructor.stripDomainParts('colony', domain);
}
