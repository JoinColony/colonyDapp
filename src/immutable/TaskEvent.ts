import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { TaskEvents } from '~data/types/TaskEvents';
import { EventTypes } from '~data/constants';

export type TaskEventType = $ReadOnly<TaskEvents>;

export type TaskEventRecordType = RecordOf<TaskEvents>;

const defaultValues: TaskEvents = {
  meta: {
    id: '',
    timestamp: Date.now(),
    userAddress: '',
    version: 0,
  },
  payload: {
    creatorAddress: '',
    draftId: '',
  },
  type: EventTypes.TASK_CREATED,
};

export const TaskEventRecord: Record.Factory<TaskEvents> = Record(
  defaultValues,
);

export default TaskEventRecord;
