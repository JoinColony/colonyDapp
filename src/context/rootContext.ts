import ApolloClient from 'apollo-client';
import { DDB } from '../lib/database';
import ENS from '../lib/ENS';
import IPFSNode from '../lib/ipfs';

import ipfsNodeContext from './ipfsNodeContext';
import DDBContext from './DDBContext';
import ensContext from './ensContext';
import apolloClientContext from './apolloClient';
import { Context } from './constants';

export type RootContext = {
  [Context.IPFS_NODE]: IPFSNode;
  [Context.DDB_CLASS]: typeof DDB;
  [Context.ENS_INSTANCE]: ENS;
  // @todo type the client cache properly
  [Context.APOLLO_CLIENT]: ApolloClient<any>;
};

export const rootContext = {
  [Context.APOLLO_CLIENT]: apolloClientContext,
  [Context.IPFS_NODE]: ipfsNodeContext,
  [Context.DDB_CLASS]: DDBContext,
  [Context.ENS_INSTANCE]: ensContext,
};

export default rootContext;
