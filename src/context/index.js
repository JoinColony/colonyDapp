/* @flow */

import walletContext from './wallet';
import networkClientContext from './networkClient';

const rootContext: Object = {
  currentWallet: walletContext,
  networkClient: networkClientContext,
};

export { default as withContext } from './withContext';

export default rootContext;
