/* @flow */

import type { Address, ENSName, OrbitDBAddress } from '~types';
import type { Command, CommandContext, DDBCommandContext } from '../types';

import {
  createTaskStore,
  getColonyStore,
  getCommentsStore,
  getTaskStore,
} from '../../stores';
import { validate } from '../utils';
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

type TaskCommand<I: *> = Command<
  CommandContext<{|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
    taskStoreAddress: OrbitDBAddress,
  |}>,
  I,
>;
type CommentCommand<I: *> = Command<
  DDBCommandContext<{|
    commentStoreAddress: OrbitDBAddress,
  |}>,
  I,
>;
type CreateTaskDraftCommandArgs = {|
  meta: string,
  creator: string,
  domainId: number,
  draftId: string,
  specificationHash: string,
  title: string,
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
  comment: {|
    signature: string,
    content: {|
      id: string,
      body: string,
      timestamp: number,
      metadata?: {|
        mentions: string[],
      |},
    |},
  |},
|};

export const createTask: TaskCommand<CreateTaskDraftCommandArgs> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
}) => ({
  async validate(args) {
    return validate(CreateTaskDraftCommandArgsSchema)(args);
  },
  async execute(args) {
    const { draftId, domainId, creator, specificationHash, title, meta } = args;
    // @TODO: Put their address on state somehow
    const { taskStore, commentsStore } = await createTaskStore(
      colonyClient,
      ddb,
      wallet,
    )({
      colonyAddress,
      colonyENSName,
    });

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

    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    });

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

export const updateTaskDraft: TaskCommand<UpdateTaskDraftCommandArgs> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { taskStoreAddress, colonyAddress, colonyENSName },
}) => ({
  async validate(args) {
    return validate(UpdateTaskDraftCommandArgsSchema)(args);
  },
  async execute(args) {
    const { specificationHash, title, meta } = args;
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      taskStoreAddress,
      colonyAddress,
      colonyENSName,
    });

    await taskStore.append(
      createDraftUpdatedEvent({
        specificationHash,
        title,
        meta,
      }),
    );

    return taskStore;
  },
});

export const setTaskDueDate: TaskCommand<SetTaskDueDateCommandArgs> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { taskStoreAddress, colonyAddress, colonyENSName },
}) => ({
  async validate(args) {
    return validate(SetTaskDueDateCommandArgsSchema)(args);
  },
  async execute(args) {
    const { dueDate } = args;
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      taskStoreAddress,
      colonyAddress,
      colonyENSName,
    });

    await taskStore.append(
      createTaskDueDateSetEvent({
        dueDate,
      }),
    );

    return taskStore;
  },
});

export const setTaskSkill: TaskCommand<SetTaskSkillCommandArgs> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { taskStoreAddress, colonyAddress, colonyENSName },
}) => ({
  async validate(args) {
    return validate(SetTaskSkillCommandArgsSchema)(args);
  },
  async execute(args) {
    const { skillId } = args;
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      taskStoreAddress,
      colonyAddress,
      colonyENSName,
    });

    await taskStore.append(
      createTaskSkillSetEvent({
        skillId,
      }),
    );

    return taskStore;
  },
});

export const createWorkRequest: TaskCommand<*> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { taskStoreAddress, colonyAddress, colonyENSName },
}) => ({
  async execute() {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      taskStoreAddress,
      colonyAddress,
      colonyENSName,
    });

    await taskStore.append(
      createWorkRequestCreatedEvent({
        worker: wallet.address,
      }),
    );

    return taskStore;
  },
});

export const sendWorkInvite: TaskCommand<SendWorkInviteCommandArgs> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { taskStoreAddress, colonyAddress, colonyENSName },
}) => ({
  async validate(args) {
    return validate(SendWorkInviteCommandArgsSchema)(args);
  },
  async execute(args) {
    const { worker } = args;
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      taskStoreAddress,
      colonyAddress,
      colonyENSName,
    });

    await taskStore.append(
      createWorkInviteSentEvent({
        worker,
        creator: wallet.address,
      }),
    );

    return taskStore;
  },
});

export const postComment: CommentCommand<PostCommentCommandArgs> = ({
  ddb,
  metadata: { commentStoreAddress },
}) => ({
  async validate(args) {
    return validate(PostCommentCommandArgsSchema)(args);
  },
  async execute(args) {
    const { comment } = args;
    const commentStore = await getCommentsStore(ddb)({
      commentStoreAddress,
    });

    await commentStore.add(
      createCommentPostedEvent({
        comment,
      }),
    );

    return commentStore;
  },
});
