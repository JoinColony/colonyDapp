/* @flow */

import nanoid from 'nanoid';

import type { Address, ENSName, OrbitDBAddress } from '~types';
import type { EventStore } from '~lib/database/stores';
import type { TaskDraftId } from '~immutable';
import type {
  ColonyClientContext,
  Command,
  ContextWithMetadata,
  DDBContext,
  WalletContext,
} from '~data/types';
import type { ColonyContext } from './colony';

import { TASK_STATUS } from '~data/constants';
import {
  createTaskStore,
  getColonyStore,
  getCommentsStore,
  getTaskStore,
} from '~data/stores';

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
    colonyName: string | ENSName,
    colonyAddress: Address,
    draftId: TaskDraftId,
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

// This is not a TaskCommand because we don't yet have a taskStoreAddress
export const createTask: Command<
  ColonyContext,
  {|
    creatorAddress: string,
  |},
  {|
    colonyStore: EventStore,
    commentsStore: EventStore,
    draftId: string,
    taskStore: EventStore,
  |},
> = ({ ddb, colonyClient, wallet, metadata: { colonyAddress }, metadata }) => ({
  schema: CreateTaskCommandArgsSchema,
  async execute({ creatorAddress }) {
    // Prefix the randomly-generated draftId with the colony address, so that
    // we can obtain the task's context and store more easily.
    // In the future, we may simply use the task store address (the IPFS hash
    // without the signature).
    const draftId = `${colonyAddress}_${nanoid()}`;

    const { taskStore, commentsStore } = await createTaskStore(
      colonyClient,
      ddb,
      wallet,
    )({ ...metadata, draftId });

    const commentsStoreAddress = commentsStore.address.toString();
    await taskStore.init(
      createCommentStoreCreatedEvent({ commentsStoreAddress }),
    );

    await taskStore.append(createTaskCreatedEvent({ creatorAddress, draftId }));

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

export const setTaskTitle: TaskCommand<
  {|
    title: string,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskTitleCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskTitleSetEvent(args));
    return taskStore;
  },
});

export const setTaskDescription: TaskCommand<
  {|
    description: string,
  |},
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
  {|
    dueDate: number,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskDueDateCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskDueDateSetEvent(args));
    return taskStore;
  },
});

export const setTaskSkill: TaskCommand<
  {|
    skillId: number,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskSkillCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskSkillSetEvent(args));
    return taskStore;
  },
});

export const createWorkRequest: TaskCommand<
  {|
    worker: string,
  |},
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
  {|
    worker: string,
  |},
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

export const postComment: CommentCommand<
  {|
    signature: string,
    content: {|
      id: string,
      author: Address,
      body: string,
      metadata?: {|
        mentions: string[],
      |},
    |},
  |},
  EventStore,
> = ({ ddb, metadata }) => ({
  schema: PostCommentCommandArgsSchema,
  async execute(args) {
    const commentStore = await getCommentsStore(ddb)(metadata);
    await commentStore.append(createCommentPostedEvent(args));
    return commentStore;
  },
});

export const setTaskPayout: TaskCommand<
  {|
    amount: string,
    token: string,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskPayoutCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskPayoutSetEvent(args));

    return taskStore;
  },
});

export const assignWorker: TaskCommand<
  {|
    worker: Address,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
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
  {|
    worker: Address,
  |},
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

export const finalizeTask: TaskCommand<
  {|
    worker: Address,
    amountPaid: string,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
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

export const cancelTask: TaskCommand<
  {|
    draftId: string,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
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
  {|
    domainId: number,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskDomainCommandArgsSchema,
  async execute(args) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    await taskStore.append(createTaskDomainSetEvent(args));
    return taskStore;
  },
});
