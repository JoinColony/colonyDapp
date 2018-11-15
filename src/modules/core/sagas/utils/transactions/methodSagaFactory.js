/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';

import type { Action, TransactionParams } from '~types/index';

import type {
  CreateTransactionAction,
  LifecycleActionTypes,
} from '../../../types';

// eslint-disable-next-line max-len
import createMethodTransaction from '../../transactions/createMethodTransaction';

export type MethodSagaFactory = <P: TransactionParams>(
  contextName: string,
  methodName: string,
  lifecycleActionTypes: LifecycleActionTypes,
) => *;

export type NetworkMethodSagaFactory = <P: TransactionParams>(
  methodName: string,
  lifecycleActionTypes: LifecycleActionTypes,
) => *;

const methodSagaFactory: MethodSagaFactory = <P: TransactionParams>(
  contextName: string,
  methodName: string,
  lifecycleActionTypes: LifecycleActionTypes,
) =>
  function* methodSaga({ type, payload }: Action): Saga<void> {
    const action: CreateTransactionAction<P> = {
      type,
      payload: {
        ...payload,
        contextName,
        methodName,
        lifecycleActionTypes,
      },
    };
    yield call(createMethodTransaction, action);
  };

export default methodSagaFactory;
