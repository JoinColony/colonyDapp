import { InfuraProvider, JsonRpcProvider, Provider } from 'ethers/providers';
import { Network } from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants';

/*
 * Return an initialized Provider instance.
 */
const getProvider = (): Provider => {
  const network = DEFAULT_NETWORK as Network;

  return network === Network.Local
    ? new JsonRpcProvider()
    : new InfuraProvider(network, process.env.INFURA_ID);
};

export default getProvider;
