/* @flow */

import { createEventCreator } from '../../utils';
import { TASK_EVENT_TYPES } from '../../constants';
import {
  CreateCommentPostedEventSchema,
  CreateCommentStoreCreatedEventSchema,
  CreateDomainSetEventSchema,
  CreateDueDateSetEventSchema,
  CreatePayoutSetEventSchema,
  CreateSkillSetEventSchema,
  CreateTaskCreatedEventSchema,
  CreateTaskDescriptionSetEventSchema,
  CreateTaskFinalizedEventSchema,
  CreateTaskTitleSetEventSchema,
  WorkerAssignmentEventSchema,
} from './schemas';

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
>(COMMENT_STORE_CREATED, CreateCommentStoreCreatedEventSchema);

export const createTaskDueDateSetEvent = createEventCreator<
  typeof DUE_DATE_SET,
>(DUE_DATE_SET, CreateDueDateSetEventSchema);

export const createTaskCreatedEvent = createEventCreator<typeof TASK_CREATED>(
  TASK_CREATED,
  CreateTaskCreatedEventSchema,
);

export const createTaskDescriptionSetEvent = createEventCreator<
  typeof TASK_DESCRIPTION_SET,
>(TASK_DESCRIPTION_SET, CreateTaskDescriptionSetEventSchema);

export const createTaskTitleSetEvent = createEventCreator<
  typeof TASK_TITLE_SET,
>(TASK_TITLE_SET, CreateTaskTitleSetEventSchema);

export const createTaskSkillSetEvent = createEventCreator<typeof SKILL_SET>(
  SKILL_SET,
  CreateSkillSetEventSchema,
);

export const createWorkInviteSentEvent = createEventCreator<
  typeof WORK_INVITE_SENT,
>(WORK_INVITE_SENT, WorkerAssignmentEventSchema);

export const createWorkRequestCreatedEvent = createEventCreator<
  typeof WORK_REQUEST_CREATED,
>(WORK_REQUEST_CREATED, WorkerAssignmentEventSchema);

export const createCommentPostedEvent = createEventCreator<
  typeof COMMENT_POSTED,
>(COMMENT_POSTED, CreateCommentPostedEventSchema);

export const createWorkerAssignedEvent = createEventCreator<
  typeof WORKER_ASSIGNED,
>(WORKER_ASSIGNED, WorkerAssignmentEventSchema);

export const createWorkerUnassignedEvent = createEventCreator<
  typeof WORKER_UNASSIGNED,
>(WORKER_UNASSIGNED, WorkerAssignmentEventSchema);

export const createTaskPayoutSetEvent = createEventCreator<typeof PAYOUT_SET>(
  PAYOUT_SET,
  CreatePayoutSetEventSchema,
);

export const createTaskCancelledEvent = createEventCreator<
  typeof TASK_CANCELLED,
>(TASK_CANCELLED);

export const createTaskClosedEvent = createEventCreator<typeof TASK_CLOSED>(
  TASK_CLOSED,
);

export const createTaskFinalizedEvent = createEventCreator<
  typeof TASK_FINALIZED,
>(TASK_FINALIZED, CreateTaskFinalizedEventSchema);

export const createTaskDomainSetEvent = createEventCreator<typeof DOMAIN_SET>(
  DOMAIN_SET,
  CreateDomainSetEventSchema,
);
