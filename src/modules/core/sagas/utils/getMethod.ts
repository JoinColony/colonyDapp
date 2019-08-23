import { call } from 'redux-saga/effects';

import { Context, getContext } from '~context/index';

import { TransactionRecordType } from '~immutable/index';
import {
  AddressOrENSName,
  ColonyContext,
} from '../../../../lib/ColonyManager/types';

export function* getMethod(
  context: ColonyContext,
  methodName: string,
  identifier?: AddressOrENSName,
) {
  const colonyManager = yield getContext(Context.COLONY_MANAGER);
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
}: TransactionRecordType) {
  return yield call(getMethod, context, methodName, identifier);
}
