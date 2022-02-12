import { Provider } from 'ethers/providers';
import { Network } from '@colony/colony-js';
import { ExtendedInfuraProvider } from './extendedInfuraProvider';
import { ExtendedJsonRpcProvider } from './extendedJsonRpcProvider';

import { DEFAULT_NETWORK } from '~constants';

/*
 * Return an initialized Provider instance.
 */
const getProvider = (customRPC?: string): Provider => {
  const network = DEFAULT_NETWORK as Network;

  if (network === Network.Local) {
    return new ExtendedJsonRpcProvider(customRPC || 'http://localhost:8545');
  }
  if (network === Network.Xdai) {
    return new ExtendedJsonRpcProvider(customRPC || process.env.RPC_URL);
  }
  if (network === Network.XdaiFork) {
    return new ExtendedJsonRpcProvider(customRPC || process.env.RPC_URL);
  }
  return new ExtendedInfuraProvider(network, process.env.INFURA_ID);
};

export default getProvider;
