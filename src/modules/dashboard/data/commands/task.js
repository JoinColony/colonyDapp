/* @flow */

import nanoid from 'nanoid';

import type { Address, ENSName, OrbitDBAddress } from '~types';
import type { TaskDraftId } from '~immutable';
import type {
  ColonyClientContext,
  ColonyStore,
  CommentsStore,
  Command,
  ContextWithMetadata,
  DDBContext,
  Event,
  TaskStore,
  WalletContext,
} from '~data/types';
import type { ColonyContext } from './colony';

import { TASK_STATUS, TASK_EVENT_TYPES } from '~data/constants';
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
    creatorAddress: Address,
  |},
  {|
    colonyStore: ColonyStore,
    commentsStore: CommentsStore,
    draftId: TaskDraftId,
    event: Event<typeof TASK_EVENT_TYPES.TASK_CREATED>,
    taskStore: TaskStore,
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

    const eventHash = await taskStore.append(
      createTaskCreatedEvent({
        creatorAddress,
        draftId,
      }),
    );

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
      event: taskStore.getEvent(eventHash),
      taskStore,
    };
  },
});

export const setTaskTitle: TaskCommand<
  {|
    title: string,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskTitleCommandArgsSchema,
  async execute({ title }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createTaskTitleSetEvent({
        title,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const setTaskDescription: TaskCommand<
  {|
    description: string,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskDescriptionCommandArgsSchema,
  async execute({ description }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createTaskDescriptionSetEvent({
        description,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const setTaskDueDate: TaskCommand<
  {|
    dueDate: number,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskDueDateCommandArgsSchema,
  async execute({ dueDate }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createTaskDueDateSetEvent({
        dueDate,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const setTaskSkill: TaskCommand<
  {|
    skillId: number,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskSkillCommandArgsSchema,
  async execute({ skillId }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createTaskSkillSetEvent({
        skillId,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const createWorkRequest: TaskCommand<
  {|
    workerAddress: Address,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  async execute({ workerAddress }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createWorkRequestCreatedEvent({
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const sendWorkInvite: TaskCommand<
  {|
    workerAddress: Address,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SendWorkInviteCommandArgsSchema,
  async execute({ workerAddress }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createWorkInviteSentEvent({
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const postComment: CommentCommand<
  {|
    signature: string,
    content: {|
      id: string,
      /*
       * The author's address is passed explicitly in the arguments (as opposed
       * to using `event.meta.userAddress`) because it gets signed alongside
       * all of the other comment data (since it is a permissive store).
       */
      author: Address,
      body: string,
      metadata?: {|
        mentions: string[],
      |},
    |},
  |},
  *,
> = ({ ddb, metadata }) => ({
  schema: PostCommentCommandArgsSchema,
  async execute(args) {
    const commentStore = await getCommentsStore(ddb)(metadata);
    const eventHash = await commentStore.append(createCommentPostedEvent(args));
    return { commentStore, event: commentStore.getEvent(eventHash) };
  },
});

export const setTaskPayout: TaskCommand<
  {|
    amount: string,
    token: string,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskPayoutCommandArgsSchema,
  async execute({ amount, token }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createTaskPayoutSetEvent({
        amount,
        token,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const assignWorker: TaskCommand<
  {|
    workerAddress: Address,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  async execute({ workerAddress }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createWorkerAssignedEvent({
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const unassignWorker: TaskCommand<
  {|
    workerAddress: Address,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  async execute({ workerAddress }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createWorkerUnassignedEvent({
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const finalizeTask: TaskCommand<
  {|
    workerAddress: Address,
    amountPaid: string,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: FinalizeTaskCommandArgsSchema,
  async execute({ workerAddress, amountPaid }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createTaskFinalizedEvent({
        amountPaid,
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const cancelTask: TaskCommand<
  {|
    draftId: TaskDraftId,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: CancelTaskCommandArgsSchema,
  async execute({ draftId }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createTaskCancelledEvent({
        status: TASK_STATUS.CANCELLED,
      }),
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
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const closeTask: TaskCommand<void, *> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  async execute() {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createTaskClosedEvent({
        status: TASK_STATUS.CLOSED,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});

export const setTaskDomain: TaskCommand<
  {|
    domainId: number,
  |},
  *,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetTaskDomainCommandArgsSchema,
  async execute({ domainId }) {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
    const eventHash = await taskStore.append(
      createTaskDomainSetEvent({
        domainId,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
});
