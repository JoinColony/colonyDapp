/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  taskId: number,
  // ENS name or Address
  colonyIdentifier: string,
|};

export type TaskReferenceType = $ReadOnly<Shared>;

export type TaskReferenceRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  taskId: undefined,
  colonyIdentifier: undefined,
};

const TaskReferenceRecord: RecordFactory<Shared> = Record(defaultValues);

export default TaskReferenceRecord;
