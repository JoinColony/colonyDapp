import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

export type TaskMetadataRecordProps = $ReadOnly<{
  commentsStoreAddress: string;
  taskStoreAddress: string;
}>;

export type TaskMetadataRecordType = RecordOf<TaskMetadataRecordProps>;

const defaultValues: TaskMetadataRecordProps = {
  commentsStoreAddress: undefined,
  taskStoreAddress: undefined,
};

export const TaskMetadataRecord: Record.Factory<
  TaskMetadataRecordProps
> = Record(defaultValues);

export default TaskMetadataRecord;
