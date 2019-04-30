/* @flow */

import BigNumber from 'bn.js';
import { List } from 'immutable';

import { ContractTransactionRecord, DataRecord } from '~immutable';

import type { DataRecordType } from '~immutable';

import mockUser from './mockUser';

const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

const mockTransactions: DataRecordType<*> = DataRecord({
  record: List([
    ContractTransactionRecord({
      amount: createBN(12),
      colonyAddress: '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
      date: new Date(),
      from: mockUser.profile.walletAddress,
      hash:
        '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
      incoming: false,
      token: '0x0000000000000000000000000000000000000000',
    }),
  ]),
  error: undefined,
  isFetching: false,
});

export default mockTransactions;
