import { Map as ImmutableMap } from 'immutable';

import { Transaction } from '~immutable';

import ns from '../../namespace';

import { oneTransaction, allTransactions } from '../transactions';

describe('Transaction selectors', () => {
  const tx1 = {
    params: { taskId: 5 },
    identifier: 'coolony',
    group: {
      key: 'taskLifecycle',
      id: ['identifier', 'params.taskId'],
      no: 1,
    },
  };
  const tx2 = {
    params: { taskId: 1 },
    identifier: 'othercolony',
    group: {
      key: 'taskLifecycle',
      id: ['identifier', 'params.taskId'],
      no: 2,
    },
  };
  test('oneTransaction selector', () => {
    const state = {
      [ns]: { transactions: { list: ImmutableMap({ tx1: Transaction(tx1) }) } },
    };
    const outTx = oneTransaction(state, 'tx1');
    expect(outTx.toJS().group).toEqual({
      key: 'taskLifecycle',
      id: 'taskLifecycle-coolony-5',
      no: 1,
    });
  });

  test('allTransactions selector', () => {
    const state = {
      [ns]: {
        transactions: {
          list: ImmutableMap({ tx1: Transaction(tx1), tx2: Transaction(tx2) }),
        },
      },
    };
    const outTx = allTransactions(state);
    expect(outTx.toJS().tx1.group).toEqual({
      key: 'taskLifecycle',
      id: 'taskLifecycle-coolony-5',
      no: 1,
    });
    expect(outTx.toJS().tx2.group).toEqual({
      key: 'taskLifecycle',
      id: 'taskLifecycle-othercolony-1',
      no: 2,
    });
  });
});
