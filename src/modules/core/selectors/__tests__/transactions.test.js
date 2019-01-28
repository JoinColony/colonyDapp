import { Map as ImmutableMap } from 'immutable';

import { Transaction } from '~immutable';

import ns from '../../namespace';

import {
  oneTransaction,
  allTransactions,
  groupedTransactions,
} from '../transactions';

describe('Transaction selectors', () => {
  const tx1 = {
    createdAt: 10,
    params: { taskId: 5 },
    identifier: 'coolony',
    group: {
      key: 'taskLifecycle',
      id: ['identifier', 'params.taskId'],
      index: 1,
    },
  };
  const tx2 = {
    createdAt: 5,
    params: { taskId: 1 },
    identifier: 'othercolony',
    group: {
      key: 'taskLifecycle',
      id: ['identifier', 'params.taskId'],
      index: 1,
    },
  };
  const tx3 = {
    createdAt: 2,
    params: { taskId: 1 },
    identifier: 'othercolony',
    group: {
      key: 'taskLifecycle',
      id: ['identifier', 'params.taskId'],
      index: 0,
    },
  };
  const tx4 = {
    createdAt: 0,
    params: { taskId: 1 },
    identifier: 'othercolony',
  };
  test('oneTransaction selector', () => {
    const state = {
      [ns]: { transactions: { list: ImmutableMap({ tx1: Transaction(tx1) }) } },
    };
    const outTx = oneTransaction(state, 'tx1');
    expect(outTx.toJS().group).toEqual({
      key: 'taskLifecycle',
      id: 'taskLifecycle-coolony-5',
      index: 1,
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
      index: 1,
    });
    expect(outTx.toJS().tx2.group).toEqual({
      key: 'taskLifecycle',
      id: 'taskLifecycle-othercolony-1',
      index: 1,
    });
  });

  test('groupedTransactions selector', () => {
    const state = {
      [ns]: {
        transactions: {
          list: ImmutableMap({
            tx1: Transaction(tx1),
            tx2: Transaction(tx2),
            tx3: Transaction(tx3),
            tx4: Transaction(tx4),
          }),
        },
      },
    };
    const grouped = groupedTransactions(state);
    const result = grouped.toList().toJS();
    expect(result[0][0].createdAt).toEqual(0);
    expect(result[1][0].group).toEqual({
      key: 'taskLifecycle',
      id: 'taskLifecycle-othercolony-1',
      index: 0,
    });
    expect(result[1][1].group).toEqual({
      key: 'taskLifecycle',
      id: 'taskLifecycle-othercolony-1',
      index: 1,
    });
  });
});
