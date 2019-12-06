import { EventTypes, TaskStates, Versions } from '../constants';
import { EventDefinition } from './events';
import { Address } from '~types/index';

export type TaskEvents =
  | EventDefinition<
      EventTypes.COMMENT_STORE_CREATED,
      {
        commentsStoreAddress: Address;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.COMMENT_STORE_CREATED,
      {
        commentsStoreAddress: Address;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.DOMAIN_SET,
      {
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.DUE_DATE_SET,
      {
        dueDate?: number;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.DUE_DATE_SET,
      {
        dueDate?: number;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.PAYOUT_SET,
      {
        amount: string;
        token: string;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.PAYOUT_SET,
      {
        amount: string;
        token: string;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      // forcing a line break for visual consistency
      EventTypes.PAYOUT_REMOVED,
      null,
      Versions.V1
    >
  | EventDefinition<
      // forcing a line break for visual consistency
      EventTypes.PAYOUT_REMOVED,
      { domainId: number },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.SKILL_SET,
      {
        skillId?: number;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.SKILL_SET,
      {
        skillId?: number;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_CLOSED,
      {
        status: TaskStates.CLOSED;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.TASK_CLOSED,
      {
        status: TaskStates.CLOSED;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_CREATED,
      {
        creatorAddress: Address;
        draftId: string;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.TASK_CREATED,
      {
        creatorAddress: Address;
        draftId: string;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_DESCRIPTION_SET,
      {
        description: string;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.TASK_DESCRIPTION_SET,
      {
        description: string;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_FINALIZED,
      {
        amountPaid: string;
        paymentTokenAddress?: Address;
        workerAddress: Address;
        transactionHash: string;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.TASK_FINALIZED,
      {
        amountPaid: string;
        paymentTokenAddress?: Address;
        workerAddress: Address;
        transactionHash: string;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.WORK_INVITE_SENT,
      {
        workerAddress: Address;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.WORK_INVITE_SENT,
      {
        workerAddress: Address;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.WORK_REQUEST_CREATED,
      {
        workerAddress: Address;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.WORKER_ASSIGNED,
      {
        workerAddress: Address;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.WORKER_ASSIGNED,
      {
        workerAddress: Address;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.WORKER_UNASSIGNED,
      {
        workerAddress: Address;
        userAddress: Address;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.WORKER_UNASSIGNED,
      {
        workerAddress: Address;
        userAddress: Address;
        domainId: number;
      },
      Versions.CURRENT
    >;
