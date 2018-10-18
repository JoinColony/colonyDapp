/* @flow */

import walletContext from './wallet';
import networkClientContext from './networkClientContext';
import ipfsNodeContext from './ipfsNodeContext';
import DDBContext from './DDBContext';

// TODO: type all the things!!

const rootContext: Object = {
  currentWallet: walletContext,
  networkClient: networkClientContext,
  ipfsNode: ipfsNodeContext,
  DDB: DDBContext,
  // networkclient: null,
  // currentWallet: null,
};

export { default as withContext } from './withContext';

export default rootContext;
