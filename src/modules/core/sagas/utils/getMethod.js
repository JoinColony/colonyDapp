/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';

import { CONTEXT, getContext } from '~context';

import type { Transaction } from '~immutable';
import type {
  AddressOrENSName,
  ColonyContext,
} from '../../../../lib/ColonyManager/types';

export function* getMethod(
  context: ColonyContext,
  methodName: string,
  identifier?: AddressOrENSName,
): Saga<*> {
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
  return yield call(
    [colonyManager, colonyManager.getMethod],
    context,
    methodName,
    identifier,
  );
}

export function* getTransactionMethod({
  context,
  methodName,
  identifier,
}: Transaction): Saga<*> {
  return yield call(getMethod, context, methodName, identifier);
}
