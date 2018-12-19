/* @flow */

import BigNumber from 'bn.js';
import { List } from 'immutable';

import { ContractTransaction } from '~immutable';

import type { ContractTransactionRecord } from '~immutable';

import mockUser from './mockUser';

const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

const mockTransactions: List<ContractTransactionRecord> = List([
  ContractTransaction({
    amount: createBN(12),
    colonyENSName: 'cool-colony',
    date: new Date(),
    from: mockUser.profile.walletAddress,
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    incoming: false,
    token: '0x0000000000000000000000000000000000000000',
  }),
]);

export default mockTransactions;
