/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type {
  TaskCommentContentRecordType,
  TaskCommentContentType,
} from './TaskCommentContent';

type Shared = {|
  signature: string,
|};

type TaskCommentRecordProps = {|
  ...Shared,
  content: TaskCommentContentRecordType,
|};

export type TaskCommentType = $ReadOnly<{|
  ...Shared,
  content: TaskCommentContentType,
|}>;

export type TaskCommentRecordType = RecordOf<TaskCommentRecordProps>;

const defaultValues: $Shape<TaskCommentRecordProps> = {
  signature: undefined,
  content: undefined,
};

const TaskCommentRecord: RecordFactory<TaskCommentRecordProps> = Record(
  defaultValues,
);

export default TaskCommentRecord;
