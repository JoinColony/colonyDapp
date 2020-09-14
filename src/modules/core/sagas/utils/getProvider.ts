import { InfuraProvider, JsonRpcProvider, Provider } from 'ethers/providers';
import { Network } from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants';

/*
 * Return an initialized Provider instance.
 */
const getProvider = (): Provider => {
  const network = DEFAULT_NETWORK as Network | 'xdai';

  if (network === Network.Local) {
    return new JsonRpcProvider();
  }
  if (network === 'xdai') {
    return new JsonRpcProvider('https://xdai.poanetwork.dev');
  }
  return new InfuraProvider(network, process.env.INFURA_ID);
};

export default getProvider;
