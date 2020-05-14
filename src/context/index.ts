import ApolloClientClass from 'apollo-client';
import { PurserWallet } from '@purser/core';

import ColonyManagerClass from '../lib/ColonyManager';

import ENSClass from '../lib/ENS';
import IPFSNode from '../lib/ipfs';

import ipfsNode from './ipfsNodeContext';
import ens from './ensContext';
import apolloClient from './apolloClient';

export enum ContextModule {
  Wallet = 'wallet',
  ColonyManager = 'colonyManager',
  IPFS = 'ipfs',
  ApolloClient = 'apolloClient',
  ENS = 'ens',
}

export interface Context {
  [ContextModule.Wallet]?: PurserWallet;
  [ContextModule.ColonyManager]?: ColonyManagerClass;
  // @todo type the client cache properly
  [ContextModule.ApolloClient]?: ApolloClientClass<object>;
  [ContextModule.IPFS]?: IPFSNode;
  [ContextModule.ENS]?: ENSClass;
}

/* Eventually the whole context will live in the newContext (not in sagas anymore). This becomes more important as we move away from redux and redux-saga entirely */
const TEMP_newContext: Context = {
  [ContextModule.ApolloClient]: apolloClient,
  [ContextModule.ColonyManager]: undefined,
  [ContextModule.ENS]: ens,
  [ContextModule.IPFS]: ipfsNode,
  [ContextModule.Wallet]: undefined,
};

export const TEMP_setContext = <K extends keyof Context>(
  contextKey: K,
  contextValue: Context[K],
) => {
  TEMP_newContext[contextKey] = contextValue;
};

export const TEMP_getContext = <K extends keyof Context>(
  contextKey: K,
): NonNullable<Context[K]> => {
  const ctx = TEMP_newContext[contextKey];
  if (!ctx) throw new Error(`Could not get context: ${contextKey}`);
  // ctx is always defined from here on
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return ctx!;
};

export const TEMP_removeContext = <K extends keyof Context>(contextKey: K) => {
  TEMP_newContext[contextKey] = undefined;
};
