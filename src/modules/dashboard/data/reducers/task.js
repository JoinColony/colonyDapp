/* @flow */

import type { EventReducer } from '~data/types';

import { TASK_EVENT_TYPES } from '~data/constants';

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
  // TODO flow types, mo problems - should be fixed in #965
  // {|
  //   amountPaid: string,
  //   commentsStoreAddress: string,
  //   createdAt: Date,
  //   creator: string,
  //   description: string,
  //   domainId: number,
  //   draftId: string,
  //   dueDate: Date,
  //   finalizedAt: Date,
  //   invites: Array<*>,
  //   paymentId: number,
  //   paymentToken: string,
  //   payout: string,
  //   requests: Array<*>,
  //   skillId: number,
  //   status: string,
  //   title: string,
  //   worker: string,
  // |},
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
        payload: { creator, draftId },
        meta: { timestamp },
      } = event;
      return {
        ...task,
        createdAt: new Date(timestamp),
        creator,
        draftId,
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
        payload: { amountPaid, paymentId, status, token, worker },
        meta: { timestamp },
      } = event;
      return {
        ...task,
        amountPaid,
        finalizedAt: new Date(timestamp),
        paymentId,
        paymentToken: token,
        status,
        worker,
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
        paymentToken: token,
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
        invites: [...invites, event.payload],
      };
    }
    case WORK_REQUEST_CREATED: {
      const { requests = [] } = task;
      return {
        ...task,
        requests: [...requests, event.payload],
      };
    }
    case WORKER_ASSIGNED: {
      const { worker } = event.payload;
      return {
        ...task,
        worker,
      };
    }
    case WORKER_UNASSIGNED: {
      const { worker: currentWorker } = task;
      const { worker } = event.payload;
      return {
        ...task,
        worker:
          currentWorker && currentWorker === worker ? undefined : currentWorker,
      };
    }

    default:
      return task;
  }
};
