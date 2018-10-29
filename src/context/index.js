/* @flow */

import { DDB } from '../lib/database';
import IPFSNode from '../lib/ipfs';

import ipfsNodeContext from './ipfsNodeContext';
import DDBContext from './DDBContext';

type RootContext = {
  ipfsNode: IPFSNode,
  DDB: typeof DDB,
};

const rootContext: RootContext = {
  ipfsNode: ipfsNodeContext,
  DDB: DDBContext,
};

export default rootContext;
