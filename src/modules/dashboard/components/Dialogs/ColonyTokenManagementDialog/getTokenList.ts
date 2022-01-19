import { Network } from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants';
import { createAddress } from '~utils/web3';

import { AnyToken } from '~data/index';

import mainnetTokenList from './tokens/tokenList.mainnet.json';
import goerliTokenList from './tokens/tokenList.goerli.json';
import xdaiTokenList from './tokens/tokenList.xdai.json';

const checksumAddresses = (token) => ({
  ...token,
  address: createAddress(token.address),
});

const getTokenList = (): AnyToken[] => {
  switch (DEFAULT_NETWORK) {
    case Network.Mainnet:
      return mainnetTokenList.map(checksumAddresses);
    case Network.Goerli:
      return goerliTokenList.map(checksumAddresses);
    case Network.Xdai:
      return xdaiTokenList.map(checksumAddresses);
    default:
      return [];
  }
};

export default getTokenList();
