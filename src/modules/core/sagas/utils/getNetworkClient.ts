import { call } from 'redux-saga/effects';
import { InfuraProvider, JsonRpcProvider } from 'ethers/providers';
import { getColonyNetworkClient, Network } from '@colony/colony-js';
import { EthersSigner } from '@purser/signer-ethers';

import { DEFAULT_NETWORK } from '~constants';
import { TEMP_getContext } from '~context/index';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
export default function* getNetworkClient() {
  const wallet = TEMP_getContext('wallet');

  if (!wallet) throw new Error('No wallet in context');

  const network = DEFAULT_NETWORK as Network;

  const provider =
    network === Network.Local
      ? new JsonRpcProvider()
      : new InfuraProvider(network, process.env.INFURA_ID);

  const signer = new EthersSigner({ purserWallet: wallet, provider });

  return yield call(getColonyNetworkClient, network, signer);
}
