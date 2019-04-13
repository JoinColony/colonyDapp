/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

export type TaskMetadataRecordProps = $ReadOnly<{|
  commentsStoreAddress: string,
  taskStoreAddress: string,
|}>;

export type TaskMetadataRecordType = RecordOf<TaskMetadataRecordProps>;

const defaultValues: $Shape<TaskMetadataRecordProps> = {
  commentsStoreAddress: undefined,
  taskStoreAddress: undefined,
};

const TaskMetadataRecord: RecordFactory<TaskMetadataRecordProps> = Record(
  defaultValues,
);

export default TaskMetadataRecord;
