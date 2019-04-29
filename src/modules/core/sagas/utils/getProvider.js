/* @flow */

import type { Saga } from 'redux-saga';

import { providers } from 'ethers';
import { call } from 'redux-saga/effects';

import { create } from '~utils/saga/effects';

export const defaultNetwork = process.env.NETWORK || 'rinkeby';

export function* getProvider(network: string = defaultNetwork): Saga<any> {
  if (network === 'local') {
    return yield create(providers.JsonRpcProvider);
  }

  // Infura project id is required
  if (!process.env.INFURA_PROJECT_ID) {
    throw new Error(`Could not get provider, INFURA_PROJECT_ID is required`);
  }

  // TODO: Use InfuraProvider instead of JsonRpcProvider and the following
  // switch statement once we have upgraded to ethers v4.

  let host;
  switch (network) {
    case 'homestead':
      host = 'mainnet.infura.io';
      break;
    case 'rinkeby':
      host = 'rinkeby.infura.io';
      break;
    default:
      throw new Error(
        `Could not get provider, unsupported network: ${network}`,
      );
  }

  return yield call(
    new providers.JsonRpcProvider(),
    `https://${host}/v3/${process.env.INFURA_PROJECT_ID || ''}`,
    network,
  );
}
