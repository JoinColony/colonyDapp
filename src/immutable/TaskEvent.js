/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { $Pick } from '~types';
import type { TaskEvents } from '~data/types/TaskEvents';

type Events = $Pick<
  TaskEvents,
  {
    DOMAIN_SET: *,
    DUE_DATE_SET: *,
    PAYOUT_SET: *,
    SKILL_SET: *,
    TASK_CANCELLED: *,
    TASK_CLOSED: *,
    TASK_CREATED: *,
    TASK_DESCRIPTION_SET: *,
    TASK_FINALIZED: *,
    TASK_TITLE_SET: *,
    WORK_INVITE_SENT: *,
    WORK_REQUEST_CREATED: *,
    WORKER_ASSIGNED: *,
    WORKER_UNASSIGNED: *,
  },
>;

type TaskEventRecordProps = {|
  type: $Keys<Events>,
  payload: Object,
|};

export type TaskEventType = $ReadOnly<TaskEventRecordProps>;

export type TaskEventRecordType = RecordOf<TaskEventRecordProps>;

const defaultValues: $Shape<TaskEventRecordProps> = {
  type: undefined,
  payload: undefined,
};

const TaskEventRecord: RecordFactory<TaskEventRecordProps> = Record(
  defaultValues,
);

export default TaskEventRecord;
