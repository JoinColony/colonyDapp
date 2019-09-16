import BigNumber from 'bn.js';
import { RecordOf, Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';

export type TaskPayoutType = Readonly<{
  amount: BigNumber;
  token: Address;
}>;

interface TaskPayoutRecordProps {
  amount: BigNumber;
  token: Address;
}

export type TaskPayoutRecordType = RecordOf<TaskPayoutRecordProps>;

const defaultValues: DefaultValues<TaskPayoutRecordProps> = {
  amount: undefined,
  token: undefined,
};

export class TaskPayoutRecord extends Record<TaskPayoutRecordProps>(
  defaultValues,
) {}

export const TaskPayout = (p: TaskPayoutRecordProps) => new TaskPayoutRecord(p);
