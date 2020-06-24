import { call } from 'redux-saga/effects';
import { getColonyNetworkClient, Network } from '@colony/colony-js';
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
      const contractABI: LocalContractABI = require(`../../../../lib/colonyNetwork/build/contracts/${contractName}.json`);
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

  if (process.env.NODE_ENV === 'development') {
    return yield call(getColonyNetworkClient, network, signer, {
      networkAddress: getLocalContractAddress('EtherRouter'),
      oneTxPaymentFactoryAddress: getLocalContractAddress(
        'OneTxPaymentFactory',
      ),
    });
  }

  return yield call(getColonyNetworkClient, network, signer);
}
