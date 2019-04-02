/* @flow */

import { createEventCreator } from '~data/utils';
import { TASK_EVENT_TYPES } from '~data/constants';

const {
  COMMENT_POSTED,
  COMMENT_STORE_CREATED,
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
} = TASK_EVENT_TYPES;

export const createCommentStoreCreatedEvent = createEventCreator<
  typeof COMMENT_STORE_CREATED,
>(COMMENT_STORE_CREATED);

export const createTaskDueDateSetEvent = createEventCreator<
  typeof DUE_DATE_SET,
>(DUE_DATE_SET);

export const createTaskCreatedEvent = createEventCreator<typeof TASK_CREATED>(
  TASK_CREATED,
);

export const createTaskDescriptionSetEvent = createEventCreator<
  typeof TASK_DESCRIPTION_SET,
>(TASK_DESCRIPTION_SET);

export const createTaskTitleSetEvent = createEventCreator<
  typeof TASK_TITLE_SET,
>(TASK_TITLE_SET);

export const createTaskSkillSetEvent = createEventCreator<typeof SKILL_SET>(
  SKILL_SET,
);

export const createWorkInviteSentEvent = createEventCreator<
  typeof WORK_INVITE_SENT,
>(WORK_INVITE_SENT);

export const createWorkRequestCreatedEvent = createEventCreator<
  typeof WORK_REQUEST_CREATED,
>(WORK_REQUEST_CREATED);

export const createCommentPostedEvent = createEventCreator<
  typeof COMMENT_POSTED,
>(COMMENT_POSTED);

export const createWorkerAssignedEvent = createEventCreator<
  typeof WORKER_ASSIGNED,
>(WORKER_ASSIGNED);

export const createWorkerUnassignedEvent = createEventCreator<
  typeof WORKER_UNASSIGNED,
>(WORKER_UNASSIGNED);

export const createTaskPayoutSetEvent = createEventCreator<typeof PAYOUT_SET>(
  PAYOUT_SET,
);

export const createTaskCancelledEvent = createEventCreator<
  typeof TASK_CANCELLED,
>(TASK_CANCELLED);

export const createTaskClosedEvent = createEventCreator<typeof TASK_CLOSED>(
  TASK_CLOSED,
);

export const createTaskFinalizedEvent = createEventCreator<
  typeof TASK_FINALIZED,
>(TASK_FINALIZED);

export const createTaskDomainSetEvent = createEventCreator<typeof DOMAIN_SET>(
  DOMAIN_SET,
);
