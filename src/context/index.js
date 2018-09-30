/* @flow */

import walletContext from './wallet';
import networkContext from './network';

const rootContext: Object = {
  currentWallet: walletContext,
  network: networkContext,
};

export { default as withContext } from './withContext';

export default rootContext;
