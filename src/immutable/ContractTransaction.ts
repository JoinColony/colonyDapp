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
  amount: new BigNumber(0),
  colonyAddress: undefined,
  date: new Date(),
  from: undefined,
  hash: '',
  incoming: false,
  taskId: undefined,
  to: undefined,
  token: '',
};

export const ContractTransactionRecord: Record.Factory<Shared> = Record(
  defaultValues,
);

export default ContractTransactionRecord;
