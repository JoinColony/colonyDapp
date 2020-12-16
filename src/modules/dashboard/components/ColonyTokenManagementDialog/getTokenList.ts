import { Network } from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants';

import mainnetTokenList from './tokens/tokenList.mainnet.json';
import goerliTokenList from './tokens/tokenList.goerli.json';
import xdaiTokenList from './tokens/tokenList.xdai.json';

const getTokenList = () => {
  switch (DEFAULT_NETWORK) {
    case Network.Mainnet:
      return mainnetTokenList;
    case Network.Goerli:
      return goerliTokenList;
    case Network.Xdai:
      return xdaiTokenList;
    default:
      return [];
  }
};

export default getTokenList();
