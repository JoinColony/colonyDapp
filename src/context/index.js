/* @flow */

import walletContext from './wallet';

const rootContext: Object = {
  currentWallet: walletContext,
};

export { default as withContext } from './withContext';

export default rootContext;
