import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

export type TaskMetadataRecordProps = Readonly<{
  commentsStoreAddress: string;
  taskStoreAddress: string;
}>;

const defaultValues: DefaultValues<TaskMetadataRecordProps> = {
  commentsStoreAddress: undefined,
  taskStoreAddress: undefined,
};

export class TaskMetadataRecord extends Record<TaskMetadataRecordProps>(
  defaultValues,
) {}

export const TaskMetadata = (p: TaskMetadataRecordProps) =>
  new TaskMetadataRecord(p);
