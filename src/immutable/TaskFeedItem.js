/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type {
  TaskFeedItemRatingRecordType,
  TaskFeedItemRatingType,
} from './TaskFeedItemRating';
import type { TaskCommentRecordType, TaskCommentType } from './TaskComment';

type Shared = {|
  id: number,
  createdAt: Date,
|};

type TaskFeedItemRecordProps = {|
  ...Shared,
  comment?: TaskCommentRecordType,
  rating?: TaskFeedItemRatingRecordType,
|};

export type TaskFeedItemType = $ReadOnly<{|
  ...Shared,
  comment?: TaskCommentType,
  rating?: TaskFeedItemRatingType,
|}>;

export type TaskFeedItemRecordType = RecordOf<TaskFeedItemRecordProps>;

export type TaskFeedItemId = $PropertyType<TaskFeedItemRecordType, 'id'>;

const defaultValues: $Shape<TaskFeedItemRecordProps> = {
  comment: undefined,
  createdAt: undefined,
  id: undefined,
  rating: undefined,
};

const TaskFeedItemRecord: RecordFactory<TaskFeedItemRecordProps> = Record(
  defaultValues,
);

export default TaskFeedItemRecord;
