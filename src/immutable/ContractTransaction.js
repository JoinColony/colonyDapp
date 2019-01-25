/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import BigNumber from 'bn.js';
import { Record } from 'immutable';

import type { Address } from '~types';

export type ContractTransactionProps = {|
  amount: BigNumber,
  colonyENSName?: string,
  date: Date,
  from?: Address,
  hash?: string,
  id: string | number,
  incoming: boolean,
  taskId?: number,
  to?: Address,
  token: Address, // 0x0 is ether
|};

export type ContractTransactionRecord = RecordOf<ContractTransactionProps>;

const defaultValues: $Shape<ContractTransactionProps> = {
  amount: undefined,
  colonyENSName: undefined,
  date: undefined,
  from: undefined,
  hash: undefined,
  id: undefined,
  incoming: undefined,
  taskId: undefined,
  to: undefined,
  token: undefined,
};

const ContractTransaction: RecordFactory<ContractTransactionProps> = Record(
  defaultValues,
);

export default ContractTransaction;
