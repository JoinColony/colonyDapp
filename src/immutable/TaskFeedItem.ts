import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import {
  ContractTransactionRecord,
  ContractTransactionType,
} from './ContractTransaction';
import { TaskCommentRecord, TaskCommentType } from './TaskComment';
import { TaskEventRecord, TaskEventType } from './TaskEvent';
import { TaskRatingRecordType, TaskRatingType } from './TaskRating';

interface Shared {
  createdAt: Date;
  id: string;
}

export type TaskFeedItemRecordProps = Shared & {
  comment?: TaskCommentRecord;
  event?: TaskEventRecord;
  rating?: TaskRatingRecordType;
  transaction?: ContractTransactionRecord;
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
  createdAt: new Date(),
  event: undefined,
  id: '',
  rating: undefined,
  transaction: undefined,
};

export const TaskFeedItemRecord: Record.Factory<
  TaskFeedItemRecordProps
> = Record(defaultValues);

export default TaskFeedItemRecord;
