import { DDB } from '../lib/database';
import ENS from '../lib/ENS';
import IPFSNode from '../lib/ipfs';

import ipfsNodeContext from './ipfsNodeContext';
import DDBContext from './DDBContext';
import ensContext from './ensContext';
import { Context } from './constants';

export type RootContext = {
  ipfsNode: IPFSNode;
  DDB: typeof DDB;
  ens: ENS;
};

export const rootContext = {
  [Context.IPFS_NODE]: ipfsNodeContext,
  [Context.DDB_CLASS]: DDBContext,
  [Context.ENS_INSTANCE]: ensContext,
};

export default rootContext;
