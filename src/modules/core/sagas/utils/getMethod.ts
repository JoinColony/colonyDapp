import { call } from 'redux-saga/effects';

import { ContextModule, TEMP_getContext } from '~context/index';
import { TransactionRecord } from '~immutable/index';
import { AddressOrENSName, ContractContext } from '~types/index';

export function* getMethod(
  context: ContractContext,
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
