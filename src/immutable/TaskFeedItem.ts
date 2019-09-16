import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

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

export type TaskFeedItemType = Readonly<
  Shared & {
    comment?: TaskCommentType;
    event?: TaskEventType;
    rating?: TaskRatingType;
    transaction?: ContractTransactionType;
  }
>;

export type TaskFeedItemId = TaskFeedItemType['id'];

const defaultValues: DefaultValues<TaskFeedItemRecordProps> = {
  comment: undefined,
  createdAt: new Date(),
  event: undefined,
  id: undefined,
  rating: undefined,
  transaction: undefined,
};

export class TaskFeedItemRecord extends Record<TaskFeedItemRecordProps>(
  defaultValues,
) {}

export const TaskFeedItem = (p: TaskFeedItemRecordProps) =>
  new TaskFeedItemRecord(p);
