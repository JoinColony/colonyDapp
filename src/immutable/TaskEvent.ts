import { Record } from 'immutable';

import { CurrentEvents } from '~data/types';
import { TaskEvents } from '~data/types/TaskEvents';
import { EventTypes } from '~data/constants';
import { DefaultValues, RecordToJS } from '~types/index';

export type TaskEventType = Readonly<TaskEvents>;

const defaultValues: DefaultValues<CurrentEvents<TaskEvents>> = {
  meta: {
    id: undefined,
    timestamp: Date.now(),
    userAddress: undefined,
    version: undefined,
  },
  payload: {
    creatorAddress: undefined,
    draftId: undefined,
  },
  type: EventTypes.TASK_CREATED,
};

export class TaskEventRecord extends Record(defaultValues)
  implements RecordToJS<TaskEventType> {}

export const TaskEvent = (p: TaskEvents) => new TaskEventRecord(p);
