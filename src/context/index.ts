import { SagaIterator } from 'redux-saga';
import { getContext as getContextOriginal } from 'redux-saga/effects';
import { PurserWallet } from '@purser/core';

import ColonyManager from '../lib/ColonyManager';
import { rootContext, RootContext } from './rootContext';
import { UserContext } from './userContext';

interface Context {
  wallet?: PurserWallet;
  colonyManger?: ColonyManager;
}

/* Eventually the whole context will live in the newContext (not in sagas anymore). This becomes more important as we move away from redux and redux-saga entirely */
const TEMP_newContext: Context = {
  wallet: undefined,
  colonyManger: undefined,
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

export type ContextType = RootContext & UserContext;

export type ContextName = keyof ContextType;

export * from './constants';

export function* getContext<C extends ContextName>(
  contextName: C,
): SagaIterator<ContextType[C]> {
  return yield getContextOriginal(contextName);
}

export default rootContext;
