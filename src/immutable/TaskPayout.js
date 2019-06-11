/* @flow */

import type BigNumber from 'bn.js';
import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

import TokenRecord from './Token';

import type { TokenRecordType, TokenType } from './Token';

/**
 * @todo Fix `TaskPayout` record props
 * @body `token` should be an address
 */
export type TaskPayoutType = $ReadOnly<{|
  amount: BigNumber,
  token: TokenType,
|}>;

type TaskPayoutRecordProps = {|
  amount: BigNumber,
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
