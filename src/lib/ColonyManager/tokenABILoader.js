/* @flow */

/*
 * A minimal version of the `Token.sol` ABI, with only `name`, `symbol` and
 * `decimals` entries included.
 */
import TokenABI from './TokenABI.json';

/**
 * Rather than use e.g. the Etherscan loader and make more/larger requests than
 * necessary, provide a loader to simply return the minimal Token ABI and the
 * given token contract address.
 */
const tokenABILoader = {
  async load({ contractAddress: address }: { contractAddress: string }) {
    return { abi: TokenABI, address };
  },
};

export default tokenABILoader;
