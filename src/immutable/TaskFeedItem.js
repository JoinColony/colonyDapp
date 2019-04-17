/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { TaskCommentRecordType, TaskCommentType } from './TaskComment';
import type { TaskEventRecordType, TaskEventType } from './TaskEvent';
import type { TaskRatingRecordType, TaskRatingType } from './TaskRating';

type Shared = {|
  createdAt: Date,
  id: string,
|};

export type TaskFeedItemRecordProps = {|
  ...Shared,
  comment?: TaskCommentRecordType,
  event?: TaskEventRecordType,
  rating?: TaskRatingRecordType,
|};

export type TaskFeedItemType = $ReadOnly<{|
  ...Shared,
  comment?: TaskCommentType,
  event?: TaskEventType,
  rating?: TaskRatingType,
|}>;

export type TaskFeedItemId = $PropertyType<TaskFeedItemType, 'id'>;

export type TaskFeedItemRecordType = RecordOf<TaskFeedItemRecordProps>;

const defaultValues: $Shape<TaskFeedItemRecordProps> = {
  comment: undefined,
  createdAt: undefined,
  event: undefined,
  id: undefined,
  rating: undefined,
};

const TaskFeedItemRecord: RecordFactory<TaskFeedItemRecordProps> = Record(
  defaultValues,
);

export default TaskFeedItemRecord;
