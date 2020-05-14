import { call } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import { TransactionRecord } from '~immutable/index';
import { AddressOrENSName } from '~types/index';

export function* getMethod(
  context: ClientType,
  methodName: string,
  identifier?: AddressOrENSName,
) {
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
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
}: TransactionRecord) {
  return yield call(getMethod, context, methodName, identifier);
}
