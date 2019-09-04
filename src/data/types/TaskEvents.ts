import { EventTypes, TaskStates } from '../constants';
import { EventDefinition } from './events';
import { Address } from '~types/index';

export type TaskEvents =
  | EventDefinition<
      EventTypes.COMMENT_POSTED,
      {
        signature: string;
        content: {
          id: string;
          author: Address;
          body: string;
        };
      }
    >
  | EventDefinition<
      EventTypes.COMMENT_STORE_CREATED,
      {
        commentsStoreAddress: Address;
      }
    >
  | EventDefinition<
      EventTypes.DOMAIN_SET,
      {
        domainId: number;
      }
    >
  | EventDefinition<
      EventTypes.DUE_DATE_SET,
      {
        dueDate?: number;
      }
    >
  | EventDefinition<
      EventTypes.PAYOUT_SET,
      {
        amount: string;
        token: string;
      }
    >
  | EventDefinition<EventTypes.PAYOUT_REMOVED, null>
  | EventDefinition<
      EventTypes.SKILL_SET,
      {
        skillId?: number;
      }
    >
  | EventDefinition<
      EventTypes.TASK_CANCELLED,
      {
        status: TaskStates.CANCELLED;
      }
    >
  | EventDefinition<
      EventTypes.TASK_CLOSED,
      {
        status: TaskStates.CLOSED;
      }
    >
  | EventDefinition<
      EventTypes.TASK_CREATED,
      {
        creatorAddress: Address;
        draftId: string;
      }
    >
  | EventDefinition<
      EventTypes.TASK_DESCRIPTION_SET,
      {
        description: string;
      }
    >
  | EventDefinition<
      EventTypes.TASK_FINALIZED,
      {
        amountPaid: string;
        paymentTokenAddress?: Address;
        workerAddress: Address;
        transactionHash: string;
      }
    >
  | EventDefinition<
      EventTypes.TASK_TITLE_SET,
      {
        title: string;
      }
    >
  | EventDefinition<
      EventTypes.WORK_INVITE_SENT,
      {
        workerAddress: Address;
      }
    >
  | EventDefinition<
      EventTypes.WORK_REQUEST_CREATED,
      {
        workerAddress: Address;
      }
    >
  | EventDefinition<
      EventTypes.WORKER_ASSIGNED,
      {
        workerAddress: Address;
      }
    >
  | EventDefinition<
      EventTypes.WORKER_UNASSIGNED,
      {
        workerAddress: Address;
        userAddress: Address;
      }
    >;
