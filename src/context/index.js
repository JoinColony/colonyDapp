/* @flow */

import type { Saga } from 'redux-saga';

import { getContext as getContextOriginal } from 'redux-saga/effects';

import rootContext from './rootContext';

import type { RootContext } from './rootContext';
import type { UserContext } from './userContext';

type ContextType = $Exact<RootContext & UserContext>;
export type ContextName = $Keys<ContextType>;

export * from './constants';

export function* getContext<C: ContextName>(
  contextName: C,
): Saga<$ElementType<ContextType, C>> {
  return yield getContextOriginal(contextName);
}

export default rootContext;
