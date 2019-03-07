/* @flow */

import type { Address, ENSName, OrbitDBAddress } from '~types';
import type {
  ColonyClientContext,
  Command,
  ContextWithMetadata,
  DDBContext,
  WalletContext,
} from '../../types';
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
  createTaskBountySetEvent,
  createTaskCancelledEvent,
  createTaskClosedEvent,
  createTaskCreatedEvent,
  createTaskDomainSetEvent,
  createTaskDueDateSetEvent,
  createTaskFinalizedEvent,
  createTaskSkillSetEvent,
  createTaskStoreRegisteredEvent,
  createTaskStoreUnregisteredEvent,
  createTaskUpdatedEvent,
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
  SetTaskBountyCommandArgsSchema,
  SetTaskDomainCommandArgsSchema,
  SetTaskDueDateCommandArgsSchema,
  SetTaskSkillCommandArgsSchema,
  UpdateTaskCommandArgsSchema,
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
  domainId: number,
  taskId: string,
  description: string,
  title: string,
|};

type CreateTaskCommandReturn = {|
  commentsStore: FeedStore,
  taskStore: EventStore,
  colonyStore: EventStore,
|};

type UpdateTaskCommandArgs = {|
  description: string,
  title: string,
|};

type SetTaskDueDateCommandArgs = {|
  dueDate: number,
|};

type SetTaskBountyCommandArgs = {|
  amount: string,
  token?: ?string,
|};

type AssignWorkerCommandArgs = {|
  worker: Address,
|};

type UnassignWorkerCommandArgs = {|
  worker: Address,
|};

type CancelTaskCommandArgs = {|
  taskId: string,
  domainId: number,
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

export const createTask: TaskCommand<
  CreateTaskCommandArgs,
  CreateTaskCommandReturn,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: CreateTaskCommandArgsSchema,
  async execute(args) {
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

    await taskStore.append(createTaskCreatedEvent(args));

    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );

    const { taskId, domainId } = args;
    await colonyStore.append(
      createTaskStoreRegisteredEvent({
        taskStoreAddress: taskStore.address.toString(),
        taskId,
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

export const updateTask: TaskCommand<UpdateTaskCommandArgs, EventStore> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  schema: UpdateTaskCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskUpdatedEvent(args));
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

export const setTaskBounty: TaskCommand<
  SetTaskBountyCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskBountyCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskBountySetEvent(args));

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
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(
      createTaskCancelledEvent({ status: TASK_STATUS.CANCELLED }),
    );

    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    const { taskId, domainId } = args;
    await colonyStore.append(
      createTaskStoreUnregisteredEvent({
        taskId,
        domainId,
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
