/* @flow */

import { DDB } from '../lib/database';
import IPFSNode from '../lib/ipfs';

import ipfsNodeContext from './ipfsNodeContext';
import DDBContext from './DDBContext';
import { CONTEXT } from './constants';

export type RootContext = {|
  ipfsNode: IPFSNode,
  DDB: typeof DDB,
|};

const rootContext: RootContext = {
  [CONTEXT.IPFS_NODE]: ipfsNodeContext,
  [CONTEXT.DDB_CLASS]: DDBContext,
};

export default rootContext;
