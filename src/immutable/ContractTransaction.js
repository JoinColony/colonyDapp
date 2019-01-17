/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import BigNumber from 'bn.js';
import { Record } from 'immutable';

import type { Address } from '~types';

export type ContractTransactionProps = {
  amount: BigNumber,
  colonyENSName?: string,
  date: Date,
  from?: Address,
  id: string | number,
  incoming: boolean,
  taskId?: number,
  to?: Address,
  token: Address, // 0x0 is ether
  hash?: string,
};

export type ContractTransactionRecord = RecordOf<ContractTransactionProps>;

const defaultValues: $Shape<ContractTransactionProps> = {
  amount: new BigNumber(),
  colonyENSName: undefined,
  date: new Date(),
  from: undefined,
  id: 0,
  incoming: false,
  taskId: undefined,
  to: undefined,
  token: '',
  hash: undefined,
};

const ContractTransaction: RecordFactory<ContractTransactionProps> = Record(
  defaultValues,
);

export default ContractTransaction;
