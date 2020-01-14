import { Record } from 'immutable';
import BigNumber from 'bn.js';

import { Address, DefaultValues, RecordToJS } from '~types/index';

interface Shared {
  amount: BigNumber;
  colonyAddress: Address;
  date: Date;
  from?: Address;
  hash: string;
  incoming: boolean;
  taskId?: number;
  to?: Address;
  token: Address; // 0x0 is ether
}

export type ContractTransactionType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  amount: undefined,
  colonyAddress: undefined,
  date: new Date(),
  from: undefined,
  hash: undefined,
  incoming: false,
  taskId: undefined,
  to: undefined,
  token: undefined,
};

export class ContractTransactionRecord extends Record<Shared>(defaultValues)
  implements RecordToJS<ContractTransactionType> {}

export const ContractTransaction = (p: Shared) =>
  new ContractTransactionRecord(p);
