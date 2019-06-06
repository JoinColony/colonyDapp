/* @flow */

import { DDB } from '../lib/database';
import ENS from '../lib/ENS';
import ColonyData from '../lib/ColonyData';
import IPFSNode from '../lib/ipfs';

import ipfsNodeContext from './ipfsNodeContext';
import DDBContext from './DDBContext';
import ensContext from './ensContext';
import colonyDataContext from './colonyDataContext';
import { CONTEXT } from './constants';

export type RootContext = {|
  ipfsNode: IPFSNode,
  DDB: typeof DDB,
  ens: ENS,
  colonyData: ColonyData,
|};

const rootContext: RootContext = {
  [CONTEXT.IPFS_NODE]: ipfsNodeContext,
  [CONTEXT.DDB_CLASS]: DDBContext,
  [CONTEXT.ENS_INSTANCE]: ensContext,
  [CONTEXT.COLONY_DATA]: colonyDataContext,
};

export default rootContext;
