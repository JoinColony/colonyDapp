import { call } from 'redux-saga/effects';
import { InfuraProvider, JsonRpcProvider } from 'ethers/providers';
import { getColonyNetworkClient, Network } from '@colony/colony-js';
import { EthersSigner } from '@purser/signer-ethers';

import { DEFAULT_NETWORK } from '~constants';
import { TEMP_getContext } from '~context/index';

interface EtherRouterABI {
  networks: Record<string, { address: string }>;
}

const getLocalEtherRouterAddress = () => {
  // NOTE we are hoping that webpack will ignore this for the production build
  if (process.env.NODE_ENV === 'development') {
    try {
      const etherRouterABI: EtherRouterABI = require('../../../../lib/colonyNetwork/build/contracts/EtherRouter.json');
      return Object.values(etherRouterABI.networks)[0].address;
    } catch {
      throw new Error(
        'Could not get local Ether router address. Please deploy contracts first',
      );
    }
  }
  return undefined;
};

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

  if (process.env.NODE_ENV === 'development') {
    return yield call(
      getColonyNetworkClient,
      network,
      signer,
      getLocalEtherRouterAddress(),
    );
  }

  return yield call(getColonyNetworkClient, network, signer);
}
