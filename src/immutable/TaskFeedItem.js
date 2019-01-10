/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { TaskFeedItemCommentRecord } from './TaskFeedItemComment';
import type { TaskFeedItemRatingRecord } from './TaskFeedItemRating';

export type TaskFeedItemProps = {
  id: number,
  createdAt: Date,
  comment?: TaskFeedItemCommentRecord,
  rating?: TaskFeedItemRatingRecord,
};

export type TaskFeedItemRecord = RecordOf<TaskFeedItemProps>;

export type TaskFeedItemId = $PropertyType<TaskFeedItemRecord, 'id'>;

const defaultValues: $Shape<TaskFeedItemProps> = {
  comment: undefined,
  createdAt: undefined,
  id: undefined,
  rating: undefined,
};

const TaskFeedItem: RecordFactory<TaskFeedItemProps> = Record(defaultValues);

export default TaskFeedItem;
