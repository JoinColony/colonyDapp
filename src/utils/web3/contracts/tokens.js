/* @flow */
/* eslint-disable import/prefer-default-export */

import type ColonyNetworkClient from '@colony/colony-js-client';

import TokenClient from '@colony/colony-js-client/lib/TokenClient';
import EthersAdapter from '@colony/colony-js-adapter-ethers';

// A minimal version of the `Token.sol` ABI, with only `name`, `symbol` and
// `decimals` entries included.
import TokenABI from './TokenABI.json';

/**
 * Rather than use e.g. the Etherscan loader and make more/larger requests than
 * necessary, provide a loader to simply return the minimal Token ABI and the
 * given token contract address.
 */
const tokenABILoader = {
  async load({ contractAddress: address }) {
    return { abi: TokenABI, address };
  },
};

/**
 * Given a token contract address, create a `TokenClient` with the minimal
 * token ABI loader and return it. The promise will be rejected if
 * the functions do not exist on the contract.
 */
export const getTokenClient = async (
  contractAddress: string,
  networkClient: ColonyNetworkClient,
) => {
  const adapter = new EthersAdapter({
    // $FlowFixMe The `ContractLoader` type is currently not exported
    loader: tokenABILoader,
    provider: networkClient.adapter.provider,
    wallet: networkClient.adapter.wallet,
  });

  const client = new TokenClient({
    adapter,
    query: { contractAddress },
  });

  await client.init();

  return client;
};
