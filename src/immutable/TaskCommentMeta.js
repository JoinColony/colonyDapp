/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, List } from 'immutable';

type TaskCommentMetaRecordProps = {|
  mentions: List<string>,
|};

export type TaskCommentMetaType = $ReadOnly<{|
  mentions: Array<string>,
|}>;

export type TaskCommentMetaRecordType = RecordOf<TaskCommentMetaRecordProps>;

const defaultValues: $Shape<TaskCommentMetaRecordProps> = {
  mentions: List(),
};

const TaskCommentMetaRecord: RecordFactory<TaskCommentMetaRecordProps> = Record(
  defaultValues,
);

export default TaskCommentMetaRecord;
