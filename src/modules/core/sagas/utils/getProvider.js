/* @flow */

import type { Saga } from 'redux-saga';

import { providers } from 'ethers';

import { create } from '~utils/saga/effects';

export const defaultNetwork = process.env.NETWORK || 'rinkeby';

export const defaultProjectId = '7d0d81d0919f4f05b9ab6634be01ee73';

export function* getProvider(network: string = defaultNetwork): Saga<any> {
  if (network === 'local') {
    return yield create(providers.JsonRpcProvider);
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

  return yield create(
    providers.JsonRpcProvider,
    `https://${host}/v3/${process.env.INFURA_PROJECT_ID || defaultProjectId}`,
    network,
  );
}
