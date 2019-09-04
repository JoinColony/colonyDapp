import { $ReadOnly } from 'utility-types';

import BigNumber from 'bn.js';
import { RecordOf, Record } from 'immutable';

import { Address } from '~types/index';

export type TaskPayoutType = $ReadOnly<{
  amount: BigNumber;
  token: Address;
}>;

interface TaskPayoutRecordProps {
  amount: BigNumber;
  token: Address;
}

export type TaskPayoutRecordType = RecordOf<TaskPayoutRecordProps>;

const defaultValues: TaskPayoutRecordProps = {
  amount: new BigNumber(0),
  token: '',
};

export const TaskPayoutRecord: Record.Factory<TaskPayoutRecordProps> = Record(
  defaultValues,
);

export default TaskPayoutRecord;
