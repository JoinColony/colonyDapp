/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, List } from 'immutable';

export type TaskCommentMetaProps = {
  mentions: List<string>,
};

export type TaskCommentMetaRecord = RecordOf<TaskCommentMetaProps>;

const defaultValues: $Shape<TaskCommentMetaProps> = {
  mentions: List(),
};

const TaskCommentMeta: RecordFactory<TaskCommentMetaProps> = Record(
  defaultValues,
);

export default TaskCommentMeta;
