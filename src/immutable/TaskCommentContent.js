/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '../types';
import type { TaskCommentMetaRecord } from './TaskCommentMeta';

export type TaskCommentContentProps = {
  id: string,
  author: Address,
  timestamp: Date,
  body: string,
  metadata?: TaskCommentMetaRecord,
};

export type TaskCommentContentRecord = RecordOf<TaskCommentContentProps>;

const defaultValues: $Shape<TaskCommentContentProps> = {
  id: undefined,
  author: undefined,
  timestamp: new Date(),
  body: undefined,
};

const TaskCommentContent: RecordFactory<TaskCommentContentProps> = Record(
  defaultValues,
);

export default TaskCommentContent;
