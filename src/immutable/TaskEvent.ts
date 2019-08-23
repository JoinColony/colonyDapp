import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { TaskEvents } from '~data/types/TaskEvents';

export type TaskEventType = $ReadOnly<TaskEvents>;

export type TaskEventRecordType = RecordOf<TaskEvents>;

const defaultValues: TaskEvents = {
  meta: undefined,
  payload: undefined,
  type: undefined,
};

export const TaskEventRecord: Record.Factory<TaskEvents> = Record(
  defaultValues,
);

export default TaskEventRecord;
