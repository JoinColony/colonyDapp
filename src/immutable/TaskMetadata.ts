import { Record } from 'immutable';

import { DefaultValues, RecordToJS } from '~types/index';

export type TaskMetadataRecordProps = Readonly<{
  commentsStoreAddress: string;
  taskStoreAddress: string;
}>;

const defaultValues: DefaultValues<TaskMetadataRecordProps> = {
  commentsStoreAddress: undefined,
  taskStoreAddress: undefined,
};

export class TaskMetadataRecord
  extends Record<TaskMetadataRecordProps>(defaultValues)
  implements RecordToJS<TaskMetadataRecordProps> {}

export const TaskMetadata = (p: TaskMetadataRecordProps) =>
  new TaskMetadataRecord(p);
