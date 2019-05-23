/* @flow */

import type { EventReducer } from '~data/types';

import { TASK_EVENT_TYPES } from '~data/constants';
import { TASK_STATE } from '~immutable/constants';

const {
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

// eslint-disable-next-line import/prefer-default-export
export const taskReducer: EventReducer<
  Object,
  {|
    COMMENT_STORE_CREATED: *,
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
> = (task, event) => {
  switch (event.type) {
    case COMMENT_STORE_CREATED: {
      const { commentsStoreAddress } = event.payload;
      return {
        ...task,
        commentsStoreAddress,
      };
    }
    case TASK_CREATED: {
      const {
        payload: { creatorAddress, draftId },
        meta: { timestamp },
      } = event;
      return {
        ...task,
        createdAt: new Date(timestamp),
        creatorAddress,
        managerAddress: creatorAddress, // @NOTE: At least for the draft version, the creator will also be the manager
        draftId,
        status: TASK_STATE.ACTIVE,
      };
    }
    case TASK_TITLE_SET: {
      const { title } = event.payload;
      return {
        ...task,
        title,
      };
    }
    case TASK_DESCRIPTION_SET: {
      const { description } = event.payload;
      return {
        ...task,
        description,
      };
    }
    case TASK_FINALIZED: {
      const {
        payload: { amountPaid, paymentId, paymentTokenAddress, workerAddress },
        meta: { timestamp },
      } = event;
      return {
        ...task,
        amountPaid,
        finalizedAt: new Date(timestamp),
        paymentId,
        paymentTokenAddress,
        workerAddress,
      };
    }
    case TASK_CANCELLED: {
      const { status } = event.payload;
      return {
        ...task,
        status,
      };
    }
    case TASK_CLOSED: {
      const { status } = event.payload;
      return {
        ...task,
        status,
      };
    }
    case PAYOUT_SET: {
      const { amount, token } = event.payload;
      return {
        ...task,
        payout: amount,
        paymentTokenAddress: token,
      };
    }
    case DUE_DATE_SET: {
      const { dueDate } = event.payload;
      return {
        ...task,
        dueDate: new Date(dueDate),
      };
    }
    case DOMAIN_SET: {
      const { domainId } = event.payload;
      return {
        ...task,
        domainId,
      };
    }
    case SKILL_SET: {
      const { skillId } = event.payload;
      return {
        ...task,
        skillId,
      };
    }
    case WORK_INVITE_SENT: {
      const { invites = [] } = task;
      return {
        ...task,
        invites: [...invites, event.payload.workerAddress],
      };
    }
    case WORK_REQUEST_CREATED: {
      const { requests = [] } = task;
      return {
        ...task,
        requests: [...requests, event.payload.workerAddress],
      };
    }
    case WORKER_ASSIGNED: {
      const { workerAddress } = event.payload;
      return {
        ...task,
        workerAddress,
      };
    }
    case WORKER_UNASSIGNED: {
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
