/* @flow */

import type BigNumber from 'bn.js';
import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '~types';

export type TaskPayoutType = $ReadOnly<{|
  amount: BigNumber,
  token: Address,
|}>;

type TaskPayoutRecordProps = {|
  amount: BigNumber,
  token: Address,
|};

export type TaskPayoutRecordType = RecordOf<TaskPayoutRecordProps>;

const defaultValues: $Shape<TaskPayoutRecordProps> = {
  amount: undefined,
  token: undefined,
};

const TaskPayoutRecord: RecordFactory<TaskPayoutRecordProps> = Record(
  defaultValues,
);

export default TaskPayoutRecord;
