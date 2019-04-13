/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import BigNumber from 'bn.js';
import { Record } from 'immutable';

import type { Address } from '~types';

type Shared = {|
  amount: BigNumber,
  colonyAddress?: Address,
  date: Date,
  from?: Address,
  hash?: string,
  id: string | number,
  incoming: boolean,
  taskId?: number,
  to?: Address,
  token: Address, // 0x0 is ether
|};

export type ContractTransactionType = $ReadOnly<Shared>;

export type ContractTransactionRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  amount: undefined,
  colonyAddress: undefined,
  date: undefined,
  from: undefined,
  hash: undefined,
  id: undefined,
  incoming: undefined,
  taskId: undefined,
  to: undefined,
  token: undefined,
};

const ContractTransactionRecord: RecordFactory<Shared> = Record(defaultValues);

export default ContractTransactionRecord;
