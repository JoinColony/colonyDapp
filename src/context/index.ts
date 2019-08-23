import { getContext as getContextOriginal } from 'redux-saga/effects';

import { rootContext, RootContext } from './rootContext';

import { UserContext } from './userContext';

type ContextType = RootContext & UserContext;

export type ContextName = keyof ContextType;

export * from './constants';

export function* getContext<C extends ContextName>(contextName: C) {
  return yield getContextOriginal(contextName);
}

export default rootContext;
