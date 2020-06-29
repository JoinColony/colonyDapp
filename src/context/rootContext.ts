import ApolloClient from 'apollo-client';
import ENS from '../lib/ENS';
import IPFSNode from '../lib/ipfs';

import ipfsNodeContext from './ipfsNodeContext';
import ensContext from './ensContext';
import apolloClientContext from './apolloClient';
import AppLoadingState from './appLoadingState';
import { Context } from './constants';

export type RootContext = {
  [Context.IPFS_NODE]: IPFSNode;
  [Context.ENS_INSTANCE]: ENS;
  // @todo type the client cache properly
  [Context.APOLLO_CLIENT]: ApolloClient<object>;
  [Context.APP_LOADING]: AppLoadingState;
};

export const rootContext = {
  [Context.APOLLO_CLIENT]: apolloClientContext,
  [Context.IPFS_NODE]: ipfsNodeContext,
  [Context.ENS_INSTANCE]: ensContext,
  [Context.APP_LOADING]: AppLoadingState,
};

export default rootContext;
