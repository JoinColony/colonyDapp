/* @flow */

import { call, getContext } from 'redux-saga/effects';

import type {
  AddressOrENSName,
  ColonyContext,
} from '../../../../lib/ColonyManager/types';

export default function* getMethod(
  context: ColonyContext,
  methodName: string,
  identifier?: AddressOrENSName,
): Generator<*, *, *> {
  const colonyManager = yield getContext('colonyManager');
  return yield call(
    [colonyManager, colonyManager.getMethod],
    context,
    methodName,
    identifier,
  );
}
