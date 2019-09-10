import { EventTypes, TaskStates, Versions } from '../constants';
import { EventDefinition } from './events';
import { Address } from '~types/index';

export type TaskEvents =
  | EventDefinition<
      EventTypes.COMMENT_STORE_CREATED,
      {
        commentsStoreAddress: Address;
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
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.PAYOUT_SET,
      {
        amount: string;
        token: string;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      // forcing a line break for visual consistency
      EventTypes.PAYOUT_REMOVED,
      null,
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.SKILL_SET,
      {
        skillId?: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_CANCELLED,
      {
        status: TaskStates.CANCELLED;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_CLOSED,
      {
        status: TaskStates.CLOSED;
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
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_TITLE_SET,
      {
        title: string;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.WORK_INVITE_SENT,
      {
        workerAddress: Address;
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
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.WORKER_UNASSIGNED,
      {
        workerAddress: Address;
        userAddress: Address;
      },
      Versions.CURRENT
    >;
