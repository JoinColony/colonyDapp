import { AnyTask } from '~data/index';
import { Address } from '~types/index';
import { EventTypes, TaskStates, Versions } from '../constants';
import { EventDefinition } from './events';

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
        draftId: AnyTask['id'];
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.TASK_CREATED,
      {
        creatorAddress: Address;
        draftId: AnyTask['id'];
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
