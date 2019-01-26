/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { TaskCommentContentRecord } from './TaskCommentMeta';

export type TaskCommentProps = {
  signature: string,
  content: TaskCommentContentRecord,
};

export type TaskCommentRecord = RecordOf<TaskCommentProps>;

const defaultValues: $Shape<TaskCommentProps> = {
  signature: undefined,
  content: undefined,
};

const TaskComment: RecordFactory<TaskCommentProps> = Record(defaultValues);

export default TaskComment;
