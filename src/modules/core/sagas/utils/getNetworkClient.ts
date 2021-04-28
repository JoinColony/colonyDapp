import { call } from 'redux-saga/effects';
import {
  getColonyNetworkClient,
  Network,
  colonyNetworkAddresses,
} from '@colony/colony-js';
import { EthersSigner } from '@purser/signer-ethers';

import { DEFAULT_NETWORK } from '~constants';
import { ContextModule, TEMP_getContext } from '~context/index';

import getProvider from './getProvider';

interface LocalContractABI {
  networks: Record<string, { address: string }>;
}

const getLocalContractAddress = (contractName: string) => {
  // process.env.DEV is set by the QA server in case we want to have a debug build. We don't have access to the compiled contracts hen
  if (process.env.NODE_ENV === 'development' && !process.env.DEV) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, max-len, global-require, import/no-dynamic-require
      const contractABI: LocalContractABI = require(`~lib/colonyNetwork/build/contracts/${contractName}.json`);
      return Object.values(contractABI.networks)[0].address;
    } catch {
      throw new Error(
        `Could not get local contract address for ${contractName}. Please deploy contracts first`,
      );
    }
  }
  return undefined;
};

/*
 * Return an initialized ColonyNetworkClient instance.
 */
export default function* getNetworkClient() {
  const wallet = TEMP_getContext(ContextModule.Wallet);

  if (!wallet) throw new Error('No wallet in context');

  const network = DEFAULT_NETWORK as Network;

  const provider = getProvider();

  const signer = new EthersSigner({ purserWallet: wallet, provider });

  if (
    process.env.NODE_ENV === 'development' &&
    DEFAULT_NETWORK === Network.Local
  ) {
    return yield call(getColonyNetworkClient, network, signer, {
      networkAddress: getLocalContractAddress('EtherRouter'),
      reputationOracleEndpoint: 'http://localhost:3001/reputation',
    });
  }

  /*
   * @TODO Temporary patch, until we figure out the proper way to handle
   * the different reputation miner for Xdai QA
   */
  if (DEFAULT_NETWORK === Network.Xdai) {
    return yield call(getColonyNetworkClient, network, signer, {
      networkAddress:
        process.env.NETWORK_CONTRACT_ADDRESS || colonyNetworkAddresses[network],
      reputationOracleEndpoint: 'https://qaxdai.colony.io/reputation/xdai-qa',
    });
  }

  return yield call(getColonyNetworkClient, network, signer, {
    /*
     * Manually set the network address to instantiate the network client
     * This is usefull for networks where we have two deployments (like xDAI)
     * and we want to be able to differentiate between them
     */
    networkAddress:
      process.env.NETWORK_CONTRACT_ADDRESS || colonyNetworkAddresses[network],
  });
}
