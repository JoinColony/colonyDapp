/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import UserRecord from './User';

import type { UserType, UserRecordType } from './User';

type TaskRatingRecordProps = {|
  ratee: UserRecordType,
  rater: UserRecordType,
  rating: number,
|};

export type TaskRatingType = $ReadOnly<{|
  ratee: UserType,
  rater: UserType,
  rating: number,
|}>;

export type TaskRatingRecordType = RecordOf<TaskRatingRecordProps>;

const defaultValues: $Shape<TaskRatingRecordProps> = {
  ratee: UserRecord(),
  rater: UserRecord(),
  rating: undefined,
};

// eslint-shame-enable
// eslint-disable-next-line max-len
const TaskRatingRecord: RecordFactory<TaskRatingRecordProps> = Record(
  defaultValues,
);

export default TaskRatingRecord;
