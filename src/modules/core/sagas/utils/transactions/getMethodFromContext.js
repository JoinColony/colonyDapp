/* @flow */

import { getContext } from 'redux-saga/effects';

import type { Sender } from '../../../types';
import type { TransactionParams, TransactionEventData } from '~types/index';

export default function* getMethodFromContext<
  P: TransactionParams,
  E: TransactionEventData,
>(contextName: string, methodName: string): Generator<*, *, Sender<P, E>> {
  const client = yield getContext(contextName);
  const { [methodName]: method } = client;
  return method;
}
