import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import BigNumber from 'bn.js';

import { Address } from '~types/index';

interface Shared {
  amount: BigNumber;
  colonyAddress?: Address;
  date: Date;
  from?: Address;
  hash: string;
  incoming: boolean;
  taskId?: number;
  to?: Address;
  token: Address; // 0x0 is ether
}

export type ContractTransactionType = $ReadOnly<Shared>;

export type ContractTransactionRecordType = RecordOf<Shared>;

const defaultValues: Shared = {
  amount: undefined,
  colonyAddress: undefined,
  date: undefined,
  from: undefined,
  hash: undefined,
  incoming: undefined,
  taskId: undefined,
  to: undefined,
  token: undefined,
};

export const ContractTransactionRecord: Record.Factory<Shared> = Record(
  defaultValues,
);

export default ContractTransactionRecord;
