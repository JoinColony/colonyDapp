import BigNumber from 'bn.js';

import { EventReducer } from '~data/types';

import { EventTypes, TaskStates } from '~data/constants';

export const taskReducer: EventReducer<{
  commentsStoreAddress?: string;
  invites?: string[];
  requests?: string[];
  workerAddress?: string;
}> = (task, event) => {
  switch (event.type) {
    case EventTypes.COMMENT_STORE_CREATED: {
      const { commentsStoreAddress } = event.payload;
      return {
        ...task,
        commentsStoreAddress,
      };
    }
    case EventTypes.TASK_CREATED: {
      const {
        payload: { creatorAddress, domainId, draftId },
        meta: { timestamp },
      } = event;
      return {
        ...task,
        createdAt: new Date(timestamp),
        creatorAddress,
        managerAddress: creatorAddress, // @NOTE: At least for the draft version, the creator will also be the manager
        draftId,
        status: TaskStates.ACTIVE,
        domainId,
      };
    }
    case EventTypes.TASK_FINALIZED: {
      const {
        payload: { amountPaid, paymentTokenAddress, workerAddress },
        meta: { timestamp },
      } = event;
      return {
        ...task,
        amountPaid,
        finalizedAt: new Date(timestamp),
        paymentTokenAddress,
        workerAddress,
      };
    }
    case EventTypes.TASK_CLOSED: {
      const { status } = event.payload;
      return {
        ...task,
        status,
      };
    }
    case EventTypes.PAYOUT_SET: {
      const { amount, token } = event.payload;
      return {
        ...task,
        payout: new BigNumber(amount),
        paymentTokenAddress: token,
      };
    }
    case EventTypes.DUE_DATE_SET: {
      const { dueDate } = event.payload;
      return {
        ...task,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      };
    }
    case EventTypes.WORK_INVITE_SENT: {
      const { invites = [] } = task;
      return {
        ...task,
        invites: [...invites, event.payload.workerAddress],
      };
    }
    case EventTypes.WORK_REQUEST_CREATED: {
      const { requests = [] } = task;
      return {
        ...task,
        requests: [...requests, event.payload.workerAddress],
      };
    }
    case EventTypes.WORKER_ASSIGNED: {
      const { workerAddress } = event.payload;
      return {
        ...task,
        workerAddress,
      };
    }
    case EventTypes.WORKER_UNASSIGNED: {
      const { workerAddress: currentWorkerAddress } = task;
      const { workerAddress } = event.payload;
      return {
        ...task,
        workerAddress:
          currentWorkerAddress && currentWorkerAddress === workerAddress
            ? undefined
            : currentWorkerAddress,
      };
    }

    default:
      return task;
  }
};
