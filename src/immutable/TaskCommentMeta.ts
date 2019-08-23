import { $ReadOnly } from 'utility-types';

import { RecordOf, Record, List } from 'immutable';

type TaskCommentMetaRecordProps = {
  mentions: List<string>;
};

export type TaskCommentMetaType = $ReadOnly<{
  mentions: string[];
}>;

export type TaskCommentMetaRecordType = RecordOf<TaskCommentMetaRecordProps>;

const defaultValues: Partial<TaskCommentMetaRecordProps> = {
  mentions: List(),
};

export const TaskCommentMetaRecord: Record.Factory<
  Partial<TaskCommentMetaRecordProps>
> = Record(defaultValues);

export default TaskCommentMetaRecord;
