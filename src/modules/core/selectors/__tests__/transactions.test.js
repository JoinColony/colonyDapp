import { Map as ImmutableMap, fromJS } from 'immutable';

import { TransactionRecord } from '~immutable';

import { CORE_NAMESPACE as ns } from '../../constants';

import { groupedTransactions } from '../transactions';

jest.mock('../../../users/selectors', () => ({
  walletAddressSelector: () => '0xdeadbeef',
}));

describe('Transaction selectors', () => {
  const tx1 = {
    createdAt: 10,
    from: '0xdeadbeef',
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
    from: '0xdeadbeef',
    params: { taskId: 1 },
    identifier: 'othercolony',
    group: {
      key: 'taskLifecycle',
      id: 'taskLifecycle-1',
      index: 1,
    },
  };
  const tx3 = {
    createdAt: 2,
    from: '0xdeadbeef',
    params: { taskId: 1 },
    identifier: 'othercolony',
    group: {
      key: 'taskLifecycle',
      id: 'taskLifecycle-1',
      index: 0,
    },
  };
  const tx4 = {
    createdAt: 0,
    from: '0xdeadbeef',
    params: { taskId: 1 },
    identifier: 'othercolony',
  };

  test('groupedTransactions selector', () => {
    const state = fromJS({
      [ns]: {
        transactions: {
          list: ImmutableMap({
            tx1: TransactionRecord(tx1),
            tx2: TransactionRecord(tx2),
            tx3: TransactionRecord(tx3),
            tx4: TransactionRecord(tx4),
          }),
        },
      },
    });
    const grouped = groupedTransactions(state);
    const result = grouped.toList().toJS();
    expect(result[0][0].createdAt).toEqual(0);
    expect(result[1][0].group).toEqual({
      key: 'taskLifecycle',
      id: 'taskLifecycle-1',
      index: 0,
    });
    expect(result[1][1].group).toEqual({
      key: 'taskLifecycle',
      id: 'taskLifecycle-1',
      index: 1,
    });
  });
});
