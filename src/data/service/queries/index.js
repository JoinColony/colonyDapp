/* @flow */

import type { Address, ENSName, OrbitDBAddress } from '~types';
import type { Query, DDBContext, ContractContext, Event } from '../../types';
import type {
  DomainCreatedEventPayload,
  CommentPostedEventPayload,
  TaskStoreCreatedEventPayload,
} from '../events';

import { getColonyStore, getCommentsStore, getTaskStore } from '../../stores';
import {
  COLONY_EVENT_TYPES,
  TASK_EVENT_TYPES,
  // USER_EVENT_TYPES,
} from '../../constants';

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

// const { READ_UNTIL } = USER_EVENT_TYPES;

export type ColonyQueryContext = ContractContext<{|
  colonyENSName: string | ENSName,
  colonyAddress: Address,
|}>;
export type TaskQueryContext = ContractContext<{|
  colonyENSName: string | ENSName,
  colonyAddress: Address,
  taskStoreAddress: string | OrbitDBAddress,
|}>;
export type CommentQueryContext = DDBContext<{|
  commentStoreAddress: string | OrbitDBAddress,
|}>;
export type UserQueryContext = DDBContext<{|
  walletAddress: string,
  username?: string,
|}>;
export type ColonyQuery<I: *, R: *> = Query<ColonyQueryContext, I, R>;
export type TaskQuery<I: *, R: *> = Query<TaskQueryContext, I, R>;
export type CommentQuery<I: *, R: *> = Query<CommentQueryContext, I, R>;
export type UserQuery<I: *, R: *> = Query<UserQueryContext, I, R>;

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
                token: payload,
              };
            }
            case AVATAR_UPLOADED: {
              const { ipfsHash, avatar } = payload;
              return {
                ...colony,
                avatar: {
                  ipfsHash,
                  avatar,
                },
              };
            }
            case AVATAR_REMOVED: {
              const { avatar } = colony;
              const { ipfsHash } = payload;
              return {
                ...colony,
                avatar: avatar && avatar.ipfsHash === ipfsHash ? null : avatar,
              };
            }
            case PROFILE_CREATED: {
              return {
                ...colony,
                profile: payload,
              };
            }
            case PROFILE_UPDATED: {
              const { profile } = colony;
              return {
                ...colony,
                profile: Object.assign({}, profile, payload),
              };
            }

            default:
              return colony;
          }
        },
        { avatar: null, profile: {}, token: {} },
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
            payload: { domainId, draftId },
          }: Event<typeof TASK_STORE_CREATED, TaskStoreCreatedEventPayload>,
        ) =>
          Object.assign({}, domainTasks, {
            [domainId]: Array.from(
              new Set([...domainTasks[domainId], draftId]),
            ),
          }),
        {},
      );
  },
});

export const getColonyDomains: ColonyQuery<*, *> = ({
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
      .filter(({ type: eventType }) => eventType === DOMAIN_CREATED)
      .reduce(
        (
          domains,
          {
            payload: { domainId },
          }: Event<typeof DOMAIN_CREATED, DomainCreatedEventPayload>,
        ) => Array.from(new Set([...domains, domainId])),
        [],
      );
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
        (
          comments,
          {
            payload: { comment },
          }: Event<typeof COMMENT_POSTED, CommentPostedEventPayload>,
        ) => [...comments, comment],
        [],
      );
  },
});
