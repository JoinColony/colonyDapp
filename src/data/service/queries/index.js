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
import type {
  DomainCreatedEvent,
  CommentPostedEvent,
  TaskStoreCreatedEvent,
} from '../events';

import { getFilterFromPartial } from '~utils/web3/eventLogs';

import { getColonyStore, getCommentsStore, getTaskStore } from '../../stores';
import { COLONY_EVENT_TYPES, TASK_EVENT_TYPES } from '../../constants';

const {
  AVATAR_REMOVED,
  AVATAR_UPLOADED,
  DOMAIN_CREATED,
  PROFILE_UPDATED,
  PROFILE_CREATED,
  TASK_STORE_CREATED,
  TOKEN_INFO_ADDED,
} = COLONY_EVENT_TYPES;

const {
  COMMENT_STORE_CREATED,
  DRAFT_CREATED,
  DRAFT_UPDATED,
  DUE_DATE_SET,
  SKILL_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  COMMENT_POSTED,
} = TASK_EVENT_TYPES;

export type ColonyQueryContext = Context<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
  |},
  ColonyClientContext & DDBContext & WalletContext,
>;

export type TaskQueryContext = Context<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
    taskStoreAddress: string | OrbitDBAddress,
  |},
  ColonyClientContext & DDBContext & WalletContext,
>;

export type CommentQueryContext = Context<
  {|
    commentStoreAddress: string | OrbitDBAddress,
  |},
  DDBContext,
>;

export type UserQueryContext = Context<
  {|
    walletAddress: string,
    username?: string,
  |},
  DDBContext,
>;

export type ColonyContractEventQuery<I: *, R: *> = Query<
  ColonyClientContext,
  I,
  R,
>;
export type ColonyQuery<I: *, R: *> = Query<ColonyQueryContext, I, R>;
export type TaskQuery<I: *, R: *> = Query<TaskQueryContext, I, R>;
export type CommentQuery<I: *, R: *> = Query<CommentQueryContext, I, R>;
export type UserQuery<I: *, R: *> = Query<UserQueryContext, I, R>;

export const getColonyAdmins: ColonyContractEventQuery<*, *> = ({
  colonyClient,
}) => ({
  async execute() {
    const COLONY_ADMIN_SET_EVENT = 'ColonyAdminRoleSet';
    const COLONY_ADMIN_REMOVED_EVENT = 'ColonyAdminRoleRemoved';
    const eventNames = [COLONY_ADMIN_SET_EVENT, COLONY_ADMIN_REMOVED_EVENT];
    // Will contain to/from block and event name topics
    const baseLog = await getFilterFromPartial(
      { eventNames, blocksBack: 400000 },
      colonyClient,
    );

    // Get logs + events for role assignment
    const removedAdminLogs = await colonyClient.contract.getLogs({
      ...baseLog,
      // [eventNames, from, to]
      topics: [[COLONY_ADMIN_REMOVED_EVENT]],
    });
    const setAdminLogs = await colonyClient.contract.getLogs({
      ...baseLog,
      // [eventNames, from, to]
      topics: [[COLONY_ADMIN_SET_EVENT]],
    });

    const removedAdmins = Array.from(
      new Set(...(removedAdminLogs.map(({ user }) => user) || [])),
    );
    return setAdminLogs.filter(({ user }) => !removedAdmins.includes(user));
  },
});

export const getColonyFounder: ColonyContractEventQuery<*, *> = ({
  colonyClient,
}) => ({
  async execute() {
    const COLONY_FOUNDER_ROLE_SET = 'ColonyFounderRoleSet';
    const eventNames = [COLONY_FOUNDER_ROLE_SET];
    // Will contain to/from block and event name topics
    const baseLog = await getFilterFromPartial(
      { eventNames, blocksBack: 400000 },
      colonyClient,
    );

    // Get logs + events for founder role assignment
    const founderChangedLogs = await colonyClient.contract.getLogs({
      ...baseLog,
      // [eventNames, from, to]
      topics: [[COLONY_FOUNDER_ROLE_SET]],
    });

    const [head] = founderChangedLogs
      .sort((a, b) => a.blockNumber - b.blockNumber)
      .reverse();

    return head && head.newFounder;
  },
});

// @TODO Add typing for query results
export const getColony: ColonyQuery<*, *> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
}) => ({
  async execute() {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    });

    const getAdminsQuery = getColonyAdmins({ colonyClient });
    const admins = await getAdminsQuery.execute();
    // const getFounderQuery = getColonyFounder({ colonyClient });
    // const founder = await getFounderQuery.execute();

    return colonyStore
      .all()
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(
        (
          colony,
          { type, payload }: Event<$Values<typeof COLONY_EVENT_TYPES>, *>,
        ) => {
          switch (type) {
            case TOKEN_INFO_ADDED: {
              return {
                ...colony,
                token: Object.assign({}, payload, { balance: 0 }),
              };
            }
            case AVATAR_UPLOADED: {
              const { ipfsHash } = payload;
              return {
                ...colony,
                avatar: ipfsHash,
              };
            }
            case AVATAR_REMOVED: {
              // const { avatar } = colony;
              // const { ipfsHash } = payload;
              return {
                ...colony,
                avatar: undefined,
              };
            }
            case PROFILE_CREATED: {
              return Object.assign({}, colony, payload);
            }
            case PROFILE_UPDATED: {
              return Object.assign({}, colony, payload);
            }
            default:
              return colony;
          }
        },
        // @TODO: Add the right defaults here using a data model or something like that
        {
          ensName: colonyENSName,
          address: colonyAddress,
          name: '',
          admins,
          token: {
            address: '',
            balance: 0,
            icon: '',
            name: '',
            symbol: '',
          },
        },
      );
  },
});

export const getColonyAvatar: ColonyQuery<*, *> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
}) => ({
  async execute() {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    });
    return colonyStore
      .all()
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(
        (
          colony,
          { type, payload }: Event<$Values<typeof COLONY_EVENT_TYPES>, *>,
        ) => {
          switch (type) {
            case AVATAR_UPLOADED: {
              const { ipfsHash, avatar } = payload;
              return {
                ipfsHash,
                avatar,
              };
            }
            case AVATAR_REMOVED: {
              return null;
            }

            default:
              return colony;
          }
        },
        null,
      );
  },
});

// @NOTE: This is a separate query so we can, later on, cache the query result
export const getColonyTasks: ColonyQuery<*, *> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
}) => ({
  async execute() {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    });
    return colonyStore
      .all()
      .filter(({ type: eventType }) => eventType === TASK_STORE_CREATED)
      .reduce(
        (
          domainTasks,
          {
            payload: { domainId, draftId, taskStoreAddress },
          }: TaskStoreCreatedEvent,
        ) =>
          Object.assign({}, domainTasks, {
            [domainId]: Object.assign({}, domainTasks[domainId], {
              [draftId]: taskStoreAddress,
            }),
          }),
        {},
      );
  },
});

export const getColonyDomains: ColonyQuery<*, *> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  async execute() {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    return colonyStore
      .all()
      .filter(({ type: eventType }) => eventType === DOMAIN_CREATED)
      .map(({ payload: { domainId, name } }: DomainCreatedEvent) => ({
        id: domainId,
        name,
      }));
  },
});

// @TODO: We should be able to merge contract events here as well
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

export const getTaskComments: CommentQuery<*, *> = ({
  ddb,
  metadata: { commentStoreAddress },
}) => ({
  async execute() {
    const commentsStore = await getCommentsStore(ddb)({
      commentStoreAddress,
    });
    return commentsStore
      .all()
      .filter(({ type: eventType }) => eventType === COMMENT_POSTED)
      .reduce(
        (comments, { payload: comment }: CommentPostedEvent) => [
          ...comments,
          comment,
        ],
        [],
      );
  },
});
