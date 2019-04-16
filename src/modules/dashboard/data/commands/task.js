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
  Event,
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
    colonyStore: EventStore,
    commentsStore: EventStore,
    draftId: TaskDraftId,
    event: Event<typeof TASK_EVENT_TYPES.TASK_CREATED>,
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

    const taskCreatedEvent = createTaskCreatedEvent({
      creatorAddress,
      draftId,
    });
    await taskStore.append(taskCreatedEvent);

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
      event: taskCreatedEvent,
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
    const event = createTaskTitleSetEvent({
      title,
      userAddress: wallet.address,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
    const event = createTaskDescriptionSetEvent({
      description,
      userAddress: wallet.address,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
    const event = createTaskDueDateSetEvent({
      dueDate,
      userAddress: wallet.address,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
    const event = createTaskSkillSetEvent({
      skillId,
      userAddress: wallet.address,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
    const event = createWorkRequestCreatedEvent({
      userAddress: wallet.address,
      workerAddress,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
    const event = createWorkInviteSentEvent({
      userAddress: wallet.address,
      workerAddress,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
  *,
> = ({ ddb, metadata }) => ({
  schema: PostCommentCommandArgsSchema,
  async execute(args) {
    const commentStore = await getCommentsStore(ddb)(metadata);
    const event = createCommentPostedEvent(args);
    await commentStore.append(event);
    return { commentStore, event };
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
    const event = createTaskPayoutSetEvent({
      amount,
      token,
      userAddress: wallet.address,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
    const event = createWorkerAssignedEvent({
      userAddress: wallet.address,
      workerAddress,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
    const event = createWorkerUnassignedEvent({
      userAddress: wallet.address,
      workerAddress,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
    const event = createTaskFinalizedEvent({
      amountPaid,
      workerAddress,
      userAddress: wallet.address,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
    const taskCancelledEvent = createTaskCancelledEvent({
      status: TASK_STATUS.CANCELLED,
    });
    await taskStore.append(taskCancelledEvent);

    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.append(
      createTaskStoreUnregisteredEvent({
        draftId,
        taskStoreAddress: taskStore.address.toString(),
      }),
    );
    return { taskStore, event: taskCancelledEvent };
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
    const event = createTaskClosedEvent({
      status: TASK_STATUS.CLOSED,
      userAddress: wallet.address,
    });
    await taskStore.append(event);
    return { taskStore, event };
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
    const event = createTaskDomainSetEvent({
      domainId,
      userAddress: wallet.address,
    });
    await taskStore.append(event);
    return { taskStore, event };
  },
});
