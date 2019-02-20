/* @flow */

import type { Address, ENSName, OrbitDBAddress } from '~types';

import type {
  ColonyClientContext,
  Context,
  DDBContext,
  Event,
  Query,
  WalletContext,
} from '../../types';

import { getTaskStore } from '../../stores';
import { TASK_EVENT_TYPES } from '../../constants';

const {
  COMMENT_STORE_CREATED,
  DRAFT_CREATED,
  DRAFT_UPDATED,
  DUE_DATE_SET,
  SKILL_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
} = TASK_EVENT_TYPES;

export type TaskQueryContext = Context<
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
            case DRAFT_CREATED: {
              return {
                ...task,
                draft: payload,
              };
            }
            case DRAFT_UPDATED: {
              const { draft } = task;
              return {
                ...task,
                draft: Object.assign({}, draft, payload),
              };
            }
            case DUE_DATE_SET: {
              const { draft } = task;
              const { dueDate } = draft || {};
              return {
                ...task,
                draft: Object.assign({}, draft, { dueDate }),
              };
            }
            case SKILL_SET: {
              const { draft } = task;
              const { skillId } = draft || {};
              return {
                ...task,
                draft: Object.assign({}, draft, { skillId }),
              };
            }
            case WORK_INVITE_SENT: {
              const { invites } = task;
              return {
                ...task,
                invites: [...invites, payload],
              };
            }
            case WORK_REQUEST_CREATED: {
              const { requests } = task;
              return {
                ...task,
                requests: [...requests, payload],
              };
            }

            default:
              return task;
          }
        },
        { draft: null, commentsStoreAddress: null, requests: [], invites: [] },
      );
  },
});
