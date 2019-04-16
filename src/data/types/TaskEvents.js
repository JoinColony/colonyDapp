/* @flow */

import { TASK_EVENT_TYPES, TASK_STATUS } from '../constants';

import type { EventDefinition } from './events';

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

export type TaskEvents = {|
  COMMENT_POSTED: EventDefinition<
    typeof COMMENT_POSTED,
    {|
      signature: string,
      content: {|
        id: string,
        author: string,
        body: string,
        timestamp: number,
        metadata?: {|
          mentions: string[],
        |},
      |},
    |},
  >,
  COMMENT_STORE_CREATED: EventDefinition<
    typeof COMMENT_STORE_CREATED,
    {|
      commentsStoreAddress: string,
    |},
  >,
  DOMAIN_SET: EventDefinition<
    typeof DOMAIN_SET,
    {|
      domainId: number,
      userAddress: string,
    |},
  >,
  DUE_DATE_SET: EventDefinition<
    typeof DUE_DATE_SET,
    {|
      dueDate: number,
      userAddress: string,
    |},
  >,
  PAYOUT_SET: EventDefinition<
    typeof PAYOUT_SET,
    {|
      amount: string,
      token: string,
      userAddress: string,
    |},
  >,
  SKILL_SET: EventDefinition<
    typeof SKILL_SET,
    {|
      skillId: number,
      userAddress: string,
    |},
  >,
  TASK_CANCELLED: EventDefinition<
    typeof TASK_CANCELLED,
    {|
      status: typeof TASK_STATUS.CANCELLED,
      userAddress: string,
    |},
  >,
  TASK_CLOSED: EventDefinition<
    typeof TASK_CLOSED,
    {|
      status: typeof TASK_STATUS.CLOSED,
      userAddress: string,
    |},
  >,
  TASK_CREATED: EventDefinition<
    typeof TASK_CREATED,
    {|
      creatorAddress: string,
      draftId: string,
    |},
  >,
  TASK_DESCRIPTION_SET: EventDefinition<
    typeof TASK_DESCRIPTION_SET,
    {|
      description: string,
      userAddress: string,
    |},
  >,
  TASK_FINALIZED: EventDefinition<
    typeof TASK_FINALIZED,
    {|
      status: typeof TASK_STATUS.FINALIZED,
      workerAddress: string,
      amountPaid: string,
      token?: string,
      paymentId?: number,
      userAddress: string,
    |},
  >,
  TASK_TITLE_SET: EventDefinition<
    typeof TASK_TITLE_SET,
    {|
      title: string,
      userAddress: string,
    |},
  >,
  WORK_INVITE_SENT: EventDefinition<
    typeof WORK_INVITE_SENT,
    {|
      userAddress: string,
      workerAddress: string,
    |},
  >,
  WORK_REQUEST_CREATED: EventDefinition<
    typeof WORK_REQUEST_CREATED,
    {|
      userAddress: string,
      workerAddress: string,
    |},
  >,
  WORKER_ASSIGNED: EventDefinition<
    typeof WORKER_ASSIGNED,
    {|
      userAddress: string,
      workerAddress: string,
    |},
  >,
  WORKER_UNASSIGNED: EventDefinition<
    typeof WORKER_UNASSIGNED,
    {|
      userAddress: string,
      workerAddress: string,
    |},
  >,
|};
