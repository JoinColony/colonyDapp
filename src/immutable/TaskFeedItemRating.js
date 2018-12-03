/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import User from './User';

import type { TaskFeedItemRatingProps } from '~types';

const defaultValues: TaskFeedItemRatingProps = {
  ratee: User(),
  rater: User(),
  rating: 0,
};

const TaskFeedItemRating: RecordFactory<TaskFeedItemRatingProps> = Record(
  defaultValues,
);

export default TaskFeedItemRating;
