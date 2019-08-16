import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import {
  ContractTransactionRecordType,
  ContractTransactionType,
} from './ContractTransaction';
import { TaskCommentRecordType, TaskCommentType } from './TaskComment';
import { TaskEventRecordType, TaskEventType } from './TaskEvent';
import { TaskRatingRecordType, TaskRatingType } from './TaskRating';

interface Shared {
  createdAt: Date;
  id: string;
}

export type TaskFeedItemRecordProps = Shared & {
  comment?: TaskCommentRecordType;
  event?: TaskEventRecordType;
  rating?: TaskRatingRecordType;
  transaction?: ContractTransactionRecordType;
};

export type TaskFeedItemType = $ReadOnly<
  Shared & {
    comment?: TaskCommentType;
    event?: TaskEventType;
    rating?: TaskRatingType;
    transaction?: ContractTransactionType;
  }
>;

export type TaskFeedItemId = TaskFeedItemType['id'];

export type TaskFeedItemRecordType = RecordOf<TaskFeedItemRecordProps>;

const defaultValues: TaskFeedItemRecordProps = {
  comment: undefined,
  createdAt: undefined,
  event: undefined,
  id: undefined,
  rating: undefined,
  transaction: undefined,
};

export const TaskFeedItemRecord: Record.Factory<
  TaskFeedItemRecordProps
> = Record(defaultValues);

export default TaskFeedItemRecord;
