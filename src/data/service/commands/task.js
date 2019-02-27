/* @flow */

import type { Address, ENSName, OrbitDBAddress } from '~types';
import type {
  ColonyClientContext,
  Command,
  Context,
  DDBContext,
  WalletContext,
} from '../../types';
import type { FeedStore, EventStore } from '../../../lib/database/stores';

import {
  createTaskStore,
  getColonyStore,
  getCommentsStore,
  getTaskStore,
} from '../../stores';
import {
  createCommentStoreCreatedEvent,
  createTaskStoreCreatedEvent,
  createDraftCreatedEvent,
  createDraftUpdatedEvent,
  createTaskDueDateSetEvent,
  createTaskSkillSetEvent,
  createWorkInviteSentEvent,
  createWorkRequestCreatedEvent,
  createCommentPostedEvent,
} from '../events';

import {
  CreateTaskDraftCommandArgsSchema,
  UpdateTaskDraftCommandArgsSchema,
  SetTaskDueDateCommandArgsSchema,
  SetTaskSkillCommandArgsSchema,
  SendWorkInviteCommandArgsSchema,
  PostCommentCommandArgsSchema,
} from './schemas';

export type TaskContext = Context<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
    taskStoreAddress: string | OrbitDBAddress,
  |},
  ColonyClientContext & WalletContext & DDBContext,
>;

export type CommentContext = Context<
  {|
    commentsStoreAddress: string | OrbitDBAddress,
  |},
  DDBContext,
>;

export type TaskCommand<I: *, R: *> = Command<TaskContext, I, R>;
export type CommentCommand<I: *, R: *> = Command<CommentContext, I, R>;

type CreateTaskDraftCommandArgs = {|
  meta: string,
  creator: string,
  domainId: number,
  draftId: string,
  specificationHash: string,
  title: string,
|};

type CreateTaskDraftCommandReturn = {|
  commentsStore: FeedStore,
  taskStore: EventStore,
  colonyStore: EventStore,
|};

type UpdateTaskDraftCommandArgs = {|
  meta: string,
  specificationHash: string,
  title: string,
|};

type SetTaskDueDateCommandArgs = {|
  dueDate: number,
|};

type SetTaskSkillCommandArgs = {|
  skillId: string,
|};

type SendWorkInviteCommandArgs = {|
  worker: string,
|};

type PostCommentCommandArgs = {|
  signature: string,
  content: {|
    id: string,
    body: string,
    timestamp: number,
    metadata?: {|
      mentions: string[],
    |},
  |},
|};

export const createTask: TaskCommand<
  CreateTaskDraftCommandArgs,
  CreateTaskDraftCommandReturn,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: CreateTaskDraftCommandArgsSchema,
  async execute({
    creator,
    domainId,
    draftId,
    meta,
    specificationHash,
    title,
  }) {
    // @TODO: Put their address on state somehow
    const { taskStore, commentsStore } = await createTaskStore(
      colonyClient,
      ddb,
      wallet,
    )(metadata);

    await taskStore.init(
      createCommentStoreCreatedEvent({
        commentsStoreAddress: commentsStore.address.toString(),
      }),
    );

    await taskStore.append(
      createDraftCreatedEvent({
        draftId,
        domainId,
        creator,
        specificationHash,
        title,
        meta,
      }),
    );

    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );

    await colonyStore.append(
      createTaskStoreCreatedEvent({
        taskStoreAddress: taskStore.address.toString(),
        draftId,
        domainId,
      }),
    );

    return {
      commentsStore,
      taskStore,
      colonyStore,
    };
  },
});

export const updateTaskDraft: TaskCommand<
  UpdateTaskDraftCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: UpdateTaskDraftCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createDraftUpdatedEvent(args));
    return taskStore;
  },
});

export const setTaskDueDate: TaskCommand<
  SetTaskDueDateCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskDueDateCommandArgsSchema,
  async execute({ dueDate }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);

    await taskStore.append(
      createTaskDueDateSetEvent({
        dueDate,
      }),
    );

    return taskStore;
  },
});

export const setTaskSkill: TaskCommand<SetTaskSkillCommandArgs, EventStore> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  schema: SetTaskSkillCommandArgsSchema,
  async execute({ skillId }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);

    await taskStore.append(
      createTaskSkillSetEvent({
        skillId,
      }),
    );

    return taskStore;
  },
});

export const createWorkRequest: TaskCommand<void, EventStore> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  async execute() {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);

    await taskStore.append(
      createWorkRequestCreatedEvent({
        worker: wallet.address,
      }),
    );

    return taskStore;
  },
});

export const sendWorkInvite: TaskCommand<
  SendWorkInviteCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SendWorkInviteCommandArgsSchema,
  async execute({ worker }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);

    await taskStore.append(
      createWorkInviteSentEvent({
        worker,
        creator: wallet.address,
      }),
    );

    return taskStore;
  },
});

export const postComment: CommentCommand<PostCommentCommandArgs, FeedStore> = ({
  ddb,
  metadata,
}) => ({
  schema: PostCommentCommandArgsSchema,
  async execute(args) {
    const commentStore = await getCommentsStore(ddb)(metadata);
    await commentStore.add(createCommentPostedEvent(args));
    return commentStore;
  },
});
