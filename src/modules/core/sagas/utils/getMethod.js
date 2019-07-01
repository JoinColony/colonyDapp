/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';

import { CONTEXT, getContext } from '~context';

import type { TransactionRecordType } from '~immutable';
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
}: TransactionRecordType): Saga<*> {
  return yield call(getMethod, context, methodName, identifier);
}
