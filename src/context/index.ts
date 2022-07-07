import { ApolloClient as ApolloClientClass } from '@apollo/client';
import { PurserWallet } from '@purser/core';

import ColonyManagerClass from '~lib/ColonyManager';

import ENSClass from '~lib/ENS';

import ens from './ensContext';
import apolloClient from './apolloClient';
import ipfsWithFallback from './ipfsWithFallbackContext';
import UserSettingsClass from './userSettings';

export { UserSettingsClass as UserSettings };

interface ExtendedPurserWallet extends PurserWallet {
  signTypedData: (
    typedData: Record<string, any>,
  ) => Promise<{ signature: string; r: string; s: string; v?: number }>;
}

export enum ContextModule {
  Wallet = 'wallet',
  ColonyManager = 'colonyManager',
  IPFS = 'ipfs',
  ApolloClient = 'apolloClient',
  ENS = 'ens',
  Pinata = 'pinataClient',
  IPFSWithFallback = 'ipfsWithFallback',
  UserSettings = 'userSettings',
}

export interface IpfsWithFallbackSkeleton {
  getString: (hash: string) => Promise<any>;
  addString: (hash: string) => Promise<any>;
}

export interface Context {
  [ContextModule.Wallet]?: ExtendedPurserWallet;
  [ContextModule.ColonyManager]?: ColonyManagerClass;
  // @todo type the client cache properly
  [ContextModule.ApolloClient]?: ApolloClientClass<object>;
  [ContextModule.ENS]?: ENSClass;
  [ContextModule.IPFSWithFallback]?: IpfsWithFallbackSkeleton;
  [ContextModule.UserSettings]?: UserSettingsClass;
}

/* Eventually the whole context will live in the newContext (not in sagas anymore). This becomes more important as we move away from redux and redux-saga entirely */
const TEMP_newContext: Context = {
  [ContextModule.ApolloClient]: apolloClient,
  [ContextModule.ColonyManager]: undefined,
  [ContextModule.ENS]: ens,
  [ContextModule.Wallet]: undefined,
  [ContextModule.IPFSWithFallback]: ipfsWithFallback,
  [ContextModule.UserSettings]: undefined,
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
