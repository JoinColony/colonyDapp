/* @flow */

import type { $Pick } from '~types';
import type { TaskEvents } from '~data/types/TaskEvents';

// fixme move this
export type TaskFeedItemEvents = $Values<
  $Pick<
    TaskEvents,
    {|
      COMMENT_POSTED: *,
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
    |},
  >,
>;
