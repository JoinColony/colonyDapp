import { SagaIterator } from 'redux-saga';
import { getContext as getContextOriginal } from 'redux-saga/effects';
import { PurserWallet } from '@purser/core';
import { ColonyNetworkClient } from '@colony/colony-js';

import { rootContext, RootContext } from './rootContext';

import { UserContext } from './userContext';

interface Context {
  wallet?: PurserWallet;
  networkClient?: ColonyNetworkClient;
}

/* Eventually the whole context will live in the newContext (not in sagas anymore). This becomes more important as we move away from redux and redux-saga entirely */
const TEMP_newContext: Context = {
  wallet: undefined,
  networkClient: undefined,
};

export const TEMP_setContext = <K extends keyof Context>(
  contextKey: K,
  contextValue: Context[K],
) => {
  TEMP_newContext[contextKey] = contextValue;
};

export const TEMP_getContext = <K extends keyof Context>(contextKey: K) =>
  TEMP_newContext[contextKey];

export const TEMP_removeContext = <K extends keyof Context>(contextKey: K) => {
  TEMP_newContext[contextKey] = undefined;
};

export type ContextType = RootContext & UserContext;

export type ContextName = keyof ContextType;

export * from './constants';

export function* getContext<C extends ContextName>(
  contextName: C,
): SagaIterator<ContextType[C]> {
  return yield getContextOriginal(contextName);
}

export default rootContext;
