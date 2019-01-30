/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import UserRecord from './User';

import type { UserType, UserRecordType } from './User';

type TaskFeedItemRatingRecordProps = {|
  ratee: UserRecordType,
  rater: UserRecordType,
  rating: number,
|};

export type TaskFeedItemRatingType = $ReadOnly<{|
  ratee: UserType,
  rater: UserType,
  rating: number,
|}>;

export type TaskFeedItemRatingRecordType = RecordOf<TaskFeedItemRatingRecordProps>;

const defaultValues: $Shape<TaskFeedItemRatingRecordProps> = {
  ratee: UserRecord(),
  rater: UserRecord(),
  rating: undefined,
};

// eslint-shame-enable
// eslint-disable-next-line max-len
const TaskFeedItemRatingRecord: RecordFactory<TaskFeedItemRatingRecordProps> = Record(
  defaultValues,
);

export default TaskFeedItemRatingRecord;
