/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

import TokenRecord from './Token';

import type { TokenRecordType, TokenType } from './Token';

/**
 * @todo Fix `TaskPayout` record props
 * @body `amount` should be a BigBumber, `token` should be an address
 */
export type TaskPayoutType = $ReadOnly<{|
  amount: number,
  token: TokenType,
|}>;

type TaskPayoutRecordProps = {|
  amount: number,
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
