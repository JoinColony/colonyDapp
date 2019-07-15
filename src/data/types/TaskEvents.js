/* @flow */

import { TASK_EVENT_TYPES, TASK_STATUS } from '../constants';

import type { EventDefinition } from './events';
import type { Address } from '~types';

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
        author: Address,
        body: string,
      |},
    |},
  >,
  COMMENT_STORE_CREATED: EventDefinition<
    typeof COMMENT_STORE_CREATED,
    {|
      commentsStoreAddress: Address,
    |},
  >,
  DOMAIN_SET: EventDefinition<
    typeof DOMAIN_SET,
    {|
      domainId: number,
    |},
  >,
  DUE_DATE_SET: EventDefinition<
    typeof DUE_DATE_SET,
    {|
      dueDate: number,
    |},
  >,
  PAYOUT_SET: EventDefinition<
    typeof PAYOUT_SET,
    {|
      amount: string,
      token: string,
    |},
  >,
  SKILL_SET: EventDefinition<
    typeof SKILL_SET,
    {|
      skillId: number,
    |},
  >,
  TASK_CANCELLED: EventDefinition<
    typeof TASK_CANCELLED,
    {|
      status: typeof TASK_STATUS.CANCELLED,
    |},
  >,
  TASK_CLOSED: EventDefinition<
    typeof TASK_CLOSED,
    {|
      status: typeof TASK_STATUS.CLOSED,
    |},
  >,
  TASK_CREATED: EventDefinition<
    typeof TASK_CREATED,
    {|
      creatorAddress: Address,
      draftId: string,
    |},
  >,
  TASK_DESCRIPTION_SET: EventDefinition<
    typeof TASK_DESCRIPTION_SET,
    {|
      description: string,
    |},
  >,
  TASK_FINALIZED: EventDefinition<
    typeof TASK_FINALIZED,
    {|
      amountPaid: string,
      paymentTokenAddress?: Address,
      workerAddress: Address,
      gasLimit: string,
      gasPrice: string,
      transactionHash: string,
    |},
  >,
  TASK_TITLE_SET: EventDefinition<
    typeof TASK_TITLE_SET,
    {|
      title: string,
    |},
  >,
  WORK_INVITE_SENT: EventDefinition<
    typeof WORK_INVITE_SENT,
    {|
      workerAddress: Address,
    |},
  >,
  WORK_REQUEST_CREATED: EventDefinition<
    typeof WORK_REQUEST_CREATED,
    {|
      workerAddress: Address,
    |},
  >,
  WORKER_ASSIGNED: EventDefinition<
    typeof WORKER_ASSIGNED,
    {|
      workerAddress: Address,
    |},
  >,
  WORKER_UNASSIGNED: EventDefinition<
    typeof WORKER_UNASSIGNED,
    {|
      workerAddress: Address,
    |},
  >,
|};
