import { getContext as getContextOriginal } from 'redux-saga/effects';

import { rootContext, RootContext } from './rootContext';

import { UserContext } from './userContext';

/* Eventually the whole context will live in the newContext (not in sagas anymore). This becomes more important as we move away from redux and redux-saga entirely */
const TEMP_newContext = new Map<string, any>();

export const TEMP_setNewContext = (contextKey: string, contextValue: any) =>
  TEMP_newContext.set(contextKey, contextValue);

export const TEMP_getNewContext = (contextKey: string) =>
  TEMP_newContext.get(contextKey);

export const TEMP_removeNewContext = (contextKey: string) =>
  TEMP_newContext.delete(contextKey);

export type ContextType = RootContext & UserContext;

export type ContextName = keyof ContextType;

export * from './constants';

export function* getContext<C extends ContextName>(contextName: C) {
  return yield getContextOriginal(contextName);
}

export default rootContext;
