/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  taskId: number,
  colonyENSName: string,
|};

export type TaskReferenceType = $ReadOnly<Shared>;

export type TaskReferencRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  taskId: undefined,
  colonyENSName: undefined,
};

const TaskReferencRecord: RecordFactory<Shared> = Record(defaultValues);

export default TaskReferencRecord;
