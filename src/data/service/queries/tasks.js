/* @flow */

import type { Address, ENSName, OrbitDBAddress } from '~types';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  Event,
  Query,
  WalletContext,
} from '../../types';

import { getTaskStore } from '../../stores';
import { TASK_EVENT_TYPES } from '../../constants';

const {
  COMMENT_STORE_CREATED,
  TASK_CREATED,
  TASK_UPDATED,
  DUE_DATE_SET,
  SKILL_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
  BOUNTY_SET,
  TASK_FINALIZED,
  TASK_CLOSED,
  TASK_CANCELLED,
} = TASK_EVENT_TYPES;

export type TaskQueryContext = ContextWithMetadata<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
    taskStoreAddress: string | OrbitDBAddress,
  |},
  ColonyClientContext & DDBContext & WalletContext,
>;

export type TaskQuery<I: *, R: *> = Query<TaskQueryContext, I, R>;

// @TODO: We should be able to merge contract events here as well
// eslint-disable-next-line import/prefer-default-export
export const getTask: TaskQuery<*, *> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName, taskStoreAddress },
}) => ({
  async execute() {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
      taskStoreAddress,
    });

    return taskStore
      .all()
      .filter(({ type: eventType }) => TASK_EVENT_TYPES[eventType])
      .reduce(
        (
          task,
          { type, payload }: Event<$Values<typeof TASK_EVENT_TYPES>, *>,
        ) => {
          switch (type) {
            case COMMENT_STORE_CREATED: {
              const { commentsStoreAddress } = payload;
              return {
                ...task,
                commentsStoreAddress,
              };
            }
            case TASK_CREATED: {
              const {
                domainId,
                taskId,
                description,
                title,
                timestamp: createdAt,
              } = payload;
              return {
                ...task,
                domainId,
                taskId,
                description,
                title,
                createdAt,
              };
            }
            case TASK_UPDATED: {
              const { description, title } = payload;
              return {
                ...task,
                description,
                title,
              };
            }
            case TASK_FINALIZED: {
              const {
                worker: assignee,
                amountPaid,
                status,
                paymentId,
                token,
                timestamp: finalizedAt,
              } = payload;
              return {
                ...task,
                paymentId,
                paymentToken: token,
                amountPaid,
                assignee,
                status,
                finalizedAt,
              };
            }
            case TASK_CANCELLED: {
              const { status } = payload;
              return {
                ...task,
                status,
              };
            }
            case TASK_CLOSED: {
              const { status } = payload;
              return {
                ...task,
                status,
              };
            }
            case BOUNTY_SET: {
              const { amount } = payload;
              return {
                ...task,
                bounty: amount,
              };
            }
            case DUE_DATE_SET: {
              const { dueDate } = payload;
              return {
                ...task,
                dueDate,
              };
            }
            case SKILL_SET: {
              const { skillId } = payload;
              return {
                ...task,
                skillId,
              };
            }
            case WORK_INVITE_SENT: {
              const { invites = [] } = task;
              return {
                ...task,
                invites: [...invites, payload],
              };
            }
            case WORK_REQUEST_CREATED: {
              const { requests = [] } = task;
              return {
                ...task,
                requests: [...requests, payload],
              };
            }
            case WORKER_ASSIGNED: {
              const { worker: assignee } = payload;
              return {
                ...task,
                assignee,
              };
            }
            case WORKER_UNASSIGNED: {
              const { assignee: currentAssignee } = task;
              const { worker: assignee } = payload;
              return {
                ...task,
                assignee:
                  currentAssignee && currentAssignee === assignee
                    ? null
                    : currentAssignee,
              };
            }

            default:
              return task;
          }
        },
        {
          assignee: null,
          bounty: null,
          dueDate: null,
          skillId: null,
          domainId: null,
          title: null,
          description: null,
          commentsStoreAddress: null,
          requests: [],
          invites: [],
        },
      );
  },
});
