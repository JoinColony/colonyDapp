/* @flow */

import type ColonyNetworkClient from '@colony/colony-js-client';

import walletContext from './wallet';
import ipfsNodeContext from './ipfsNodeContext';
import DDBContext from './DDBContext';

// TODO: type all the things!!

type RootContext = {
  networkClient: ?ColonyNetworkClient,
};

const rootContext: RootContext = {
  currentWallet: walletContext,
  networkClient: null,
  ipfsNode: ipfsNodeContext,
  DDB: DDBContext,
  // currentWallet: null,
};

export { default as withContext } from './withContext';

export default rootContext;
