/* @flow */

import type { RecordFactory, RecordOf, List as ListType } from 'immutable';

import { Record } from 'immutable';

import type { DataRecordType, DataType } from './Data';
import type { TaskRecordType, TaskType } from './Task';
import type { TaskFeedItemRecordType, TaskFeedItemType } from './TaskFeedItem';

type Shared = {|
  colonyENSName: string,
  commentsStoreAddress: string,
  draftId: string,
  taskStoreAddress: string,
|};

export type TaskReferenceType = $ReadOnly<{|
  ...Shared,
  task: DataType<TaskType>,
  feedItems: DataType<Array<TaskFeedItemType>>,
|}>;

type TaskReferenceRecordProps = {|
  ...Shared,
  task: DataRecordType<TaskRecordType>,
  feedItems: DataRecordType<ListType<TaskFeedItemRecordType>>,
|};

export type TaskReferenceRecordType = RecordOf<TaskReferenceRecordProps>;

const defaultValues: $Shape<TaskReferenceRecordProps> = {
  colonyENSName: undefined,
  commentsStoreAddress: undefined,
  draftId: undefined,
  feedItems: undefined,
  task: undefined,
  taskStoreAddress: undefined,
};

const TaskReferenceRecord: RecordFactory<TaskReferenceRecordProps> = Record(
  defaultValues,
);

export default TaskReferenceRecord;
