/* @flow */

import nanoid from 'nanoid';

import type { Address, ENSName, OrbitDBAddress } from '~types';
import type {
  ColonyClientContext,
  Command,
  ContextWithMetadata,
  DDBContext,
  WalletContext,
} from '../../types';
import type { ColonyContext } from './colony';
import type { FeedStore, EventStore } from '../../../lib/database/stores';

import { TASK_STATUS } from '../../constants';
import {
  createTaskStore,
  getColonyStore,
  getCommentsStore,
  getTaskStore,
} from '../../stores';

import {
  createCommentPostedEvent,
  createCommentStoreCreatedEvent,
  createTaskCancelledEvent,
  createTaskClosedEvent,
  createTaskCreatedEvent,
  createTaskDescriptionSetEvent,
  createTaskDomainSetEvent,
  createTaskDueDateSetEvent,
  createTaskFinalizedEvent,
  createTaskPayoutSetEvent,
  createTaskSkillSetEvent,
  createTaskStoreRegisteredEvent,
  createTaskStoreUnregisteredEvent,
  createTaskTitleSetEvent,
  createWorkerAssignedEvent,
  createWorkerUnassignedEvent,
  createWorkInviteSentEvent,
  createWorkRequestCreatedEvent,
} from '../events';

import {
  CancelTaskCommandArgsSchema,
  CreateTaskCommandArgsSchema,
  FinalizeTaskCommandArgsSchema,
  PostCommentCommandArgsSchema,
  SendWorkInviteCommandArgsSchema,
  SetTaskDescriptionCommandArgsSchema,
  SetTaskDomainCommandArgsSchema,
  SetTaskDueDateCommandArgsSchema,
  SetTaskPayoutCommandArgsSchema,
  SetTaskSkillCommandArgsSchema,
  SetTaskTitleCommandArgsSchema,
} from './schemas';

export type TaskContext = ContextWithMetadata<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
    taskStoreAddress: string | OrbitDBAddress,
  |},
  ColonyClientContext & WalletContext & DDBContext,
>;

export type CommentContext = ContextWithMetadata<
  {|
    commentsStoreAddress: string | OrbitDBAddress,
  |},
  DDBContext,
>;

export type TaskCommand<I: *, R: *> = Command<TaskContext, I, R>;
export type CommentCommand<I: *, R: *> = Command<CommentContext, I, R>;

type CreateTaskCommandArgs = {|
  creator: string,
|};

type CreateTaskCommandReturn = {|
  colonyStore: EventStore,
  commentsStore: FeedStore,
  draftId: string,
  taskStore: EventStore,
|};

type SetTaskTitleCommandArgs = {|
  title: string,
|};

type SetTaskDescriptionCommandArgs = {|
  description: string,
|};

type SetTaskDueDateCommandArgs = {|
  dueDate: number,
|};

type SetTaskPayoutCommandArgs = {|
  amount: string,
  token: string,
|};

type AssignWorkerCommandArgs = {|
  worker: Address,
|};

type UnassignWorkerCommandArgs = {|
  worker: Address,
|};

type CancelTaskCommandArgs = {|
  draftId: string,
|};

type FinalizeTaskCommandArgs = {|
  worker: Address,
  amountPaid: string,
|};

type SetTaskSkillCommandArgs = {|
  skillId: number,
|};

type CreateWorkRequestCommandArgs = {|
  worker: string,
|};

type SetTaskDomainCommandArgs = {|
  domainId: number,
|};

type SendWorkInviteCommandArgs = {|
  worker: string,
|};

type PostCommentCommandArgs = {|
  signature: string,
  content: {|
    id: string,
    author: Address,
    body: string,
    timestamp: number,
    metadata?: {|
      mentions: string[],
    |},
  |},
|};

// This is not a TaskCommand because we don't yet have a taskStoreAddress
export const createTask: Command<
  ColonyContext,
  CreateTaskCommandArgs,
  CreateTaskCommandReturn,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: CreateTaskCommandArgsSchema,
  async execute({ creator }) {
    const draftId = nanoid();
    const { taskStore, commentsStore } = await createTaskStore(
      colonyClient,
      ddb,
      wallet,
    )({ ...metadata, draftId });

    const commentsStoreAddress = commentsStore.address.toString();
    await taskStore.init(
      createCommentStoreCreatedEvent({ commentsStoreAddress }),
    );

    await taskStore.append(createTaskCreatedEvent({ creator, draftId }));

    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );

    await colonyStore.append(
      createTaskStoreRegisteredEvent({
        commentsStoreAddress,
        draftId,
        taskStoreAddress: taskStore.address.toString(),
      }),
    );

    return {
      colonyStore,
      commentsStore,
      draftId,
      taskStore,
    };
  },
});

export const setTaskTitle: TaskCommand<SetTaskTitleCommandArgs, EventStore> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  schema: SetTaskTitleCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskTitleSetEvent(args));
    return taskStore;
  },
});

export const setTaskDescription: TaskCommand<
  SetTaskDescriptionCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskDescriptionCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskDescriptionSetEvent(args));
    return taskStore;
  },
});

export const setTaskDueDate: TaskCommand<
  SetTaskDueDateCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskDueDateCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskDueDateSetEvent(args));
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
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskSkillSetEvent(args));
    return taskStore;
  },
});

export const createWorkRequest: TaskCommand<
  CreateWorkRequestCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  async execute({ worker }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(
      createWorkRequestCreatedEvent({
        worker,
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

export const setTaskPayout: TaskCommand<
  SetTaskPayoutCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskPayoutCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskPayoutSetEvent(args));

    return taskStore;
  },
});

export const assignWorker: TaskCommand<AssignWorkerCommandArgs, EventStore> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  async execute({ worker }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(
      createWorkerAssignedEvent({
        worker,
      }),
    );

    return taskStore;
  },
});

export const unassignWorker: TaskCommand<
  UnassignWorkerCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  async execute({ worker }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(
      createWorkerUnassignedEvent({
        worker,
      }),
    );

    return taskStore;
  },
});

export const finalizeTask: TaskCommand<FinalizeTaskCommandArgs, EventStore> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  schema: FinalizeTaskCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(
      createTaskFinalizedEvent(
        Object.assign({}, args, { status: TASK_STATUS.FINALIZED }),
      ),
    );

    return taskStore;
  },
});

export const cancelTask: TaskCommand<CancelTaskCommandArgs, EventStore> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  schema: CancelTaskCommandArgsSchema,
  async execute({ draftId }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(
      createTaskCancelledEvent({ status: TASK_STATUS.CANCELLED }),
    );

    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.append(
      createTaskStoreUnregisteredEvent({
        draftId,
        taskStoreAddress: taskStore.address.toString(),
      }),
    );

    return taskStore;
  },
});

export const closeTask: TaskCommand<void, EventStore> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  async execute() {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(
      createTaskClosedEvent({ status: TASK_STATUS.CLOSED }),
    );

    return taskStore;
  },
});

export const setTaskDomain: TaskCommand<
  SetTaskDomainCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskDomainCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskDomainSetEvent(args));
    return taskStore;
  },
});
