/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';
import BigNumber from 'bn.js';

import TokenRecord from './Token';

import type { TokenRecordType, TokenType } from './Token';

export type TaskPayoutType = $ReadOnly<{|
  amount: number, // TODO: should be BigNumber
  token: TokenType,
|}>;

type TaskPayoutRecordProps = {|
  amount: number, // TODO: should be BigNumber
  token: TokenRecordType,
|};

export type TaskPayoutRecordType = RecordOf<TaskPayoutRecordProps>;

const defaultValues: $Shape<TaskPayoutRecordProps> = {
  amount: undefined,
  token: TokenRecord(),
};

const TaskPayoutRecord: RecordFactory<TaskPayoutRecordProps> = Record(
  defaultValues,
);

export default TaskPayoutRecord;
