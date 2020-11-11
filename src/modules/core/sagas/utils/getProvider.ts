import { InfuraProvider, JsonRpcProvider, Provider } from 'ethers/providers';
import { Network } from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants';

/*
 * Return an initialized Provider instance.
 */
const getProvider = (): Provider => {
  const network = DEFAULT_NETWORK as Network;

  if (network === Network.Local) {
    return new JsonRpcProvider();
  }
  if (network === Network.Xdai) {
    return new JsonRpcProvider('https://xdai.poanetwork.dev');
  }
  if (network === Network.XdaiFork) {
    return new JsonRpcProvider('https://qaxdai.colony.io/rpc/');
  }
  return new InfuraProvider(network, process.env.INFURA_ID);
};

export default getProvider;
