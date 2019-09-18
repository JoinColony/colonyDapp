import { Map as ImmutableMap, fromJS } from 'immutable';

import { TransactionRecord } from '~immutable/index';

import { CORE_NAMESPACE as ns } from '../../constants';

import {
  groupedTransactions,
  transactionByHash,
  oneTransaction,
} from '../transactions';

jest.mock('../../../users/selectors', () => ({
  walletAddressSelector: () => '0xdeadbeef',
}));

describe('Transaction selectors', () => {
  const tx1 = {
    createdAt: 10,
    from: '0xdeadbeef',
    params: { taskId: 5 },
    identifier: 'coolony',
    hash: '0x910ffad854fe8957f8ba2e581c891cdc8bacbcfdb1af3fc359c3ad1118175e26',
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
    hash: '0x910ffad854fe8957f8ba2e581c891cdc8bacbcfdb1af3fc359c3ad1118175e27',
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
            // @ts-ignore
            tx4: TransactionRecord(tx4),
            // @ts-ignore
            tx3: TransactionRecord(tx3),
            // @ts-ignore
            tx2: TransactionRecord(tx2),
            // @ts-ignore
            tx1: TransactionRecord(tx1),
          }),
        },
      },
    });
    const grouped = groupedTransactions(state);
    const result = grouped.toList().toJS();
    expect(result[0][0].createdAt).toEqual(10);
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

  test('transactionByHash selector', () => {
    const state = fromJS({
      [ns]: {
        transactions: {
          list: ImmutableMap({
            // @ts-ignore
            tx1: TransactionRecord(tx1),
            // @ts-ignore
            tx2: TransactionRecord(tx2),
          }),
        },
      },
    });
    const found = transactionByHash(
      state,
      '0x910ffad854fe8957f8ba2e581c891cdc8bacbcfdb1af3fc359c3ad1118175e26',
    );
    const result = found.toJS();
    expect(result.hash).toEqual(
      '0x910ffad854fe8957f8ba2e581c891cdc8bacbcfdb1af3fc359c3ad1118175e26',
    );
  });

  test('oneTransaction selector', () => {
    const state = fromJS({
      [ns]: {
        transactions: {
          list: ImmutableMap({
            // @ts-ignore
            tx1: TransactionRecord(tx1),
            // @ts-ignore
            tx2: TransactionRecord(tx2),
          }),
        },
      },
    });
    const found = oneTransaction(state, 'tx2');

    const result = found.toJS();
    expect(result.from).toEqual('0xdeadbeef');
    expect(result.identifier).toEqual('othercolony');
  });
});
