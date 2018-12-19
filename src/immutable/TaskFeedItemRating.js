/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import User from './User';

import type { UserRecord } from './User';

export type TaskFeedItemRatingProps = {|
  ratee: UserRecord,
  rater: UserRecord,
  rating: number,
|};

export type TaskFeedItemRatingRecord = RecordOf<TaskFeedItemRatingProps>;

const defaultValues: $Shape<TaskFeedItemRatingProps> = {
  ratee: User(),
  rater: User(),
  rating: undefined,
};

const TaskFeedItemRating: RecordFactory<TaskFeedItemRatingProps> = Record(
  defaultValues,
);

export default TaskFeedItemRating;
