/* @flow */

import type { Saga } from 'redux-saga';

import { providers } from 'ethers';
import { call } from 'redux-saga/effects';

import { create } from '~utils/saga/effects';

export const defaultNetwork = process.env.NETWORK || 'rinkeby';

export function* getJsonRPCProvider(
  network: string = defaultNetwork,
): Saga<any> {
  if (network === 'local') {
    return yield create(providers.JsonRpcProvider);
  }
  return yield call(providers.getDefaultProvider, network);
}
