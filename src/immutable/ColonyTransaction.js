/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';
import type BigNumber from 'bn.js';

import { Record } from 'immutable';

import type { Address } from '~types';

export type ColonyTransactionProps = {
  amount: BigNumber,
  date: Date,
  from?: Address,
  incoming: boolean,
  taskId?: number,
  to?: Address,
  token: Address,
  transactionHash?: string,
};

export type ColonyTransactionRecord = RecordOf<ColonyTransactionProps>;

const defaultValues: ColonyTransactionProps = {
  amount: 0,
  date: new Date(),
  from: undefined,
  incoming: false,
  taskId: undefined,
  to: undefined,
  token: '0x0000000000000000000000000000000000000000',
  transactionHash: undefined,
};

const ColonyTransaction: RecordFactory<ColonyTransactionProps> = Record(
  defaultValues,
);

export default ColonyTransaction;
