/* @flow */

import type { Address } from '~types';
import type { TaskDraftId } from '~immutable';
import type {
  CommentsStore,
  ColonyManager,
  ColonyStore,
  Command,
  DDB,
  Event,
  TaskStore,
  Wallet,
} from '~data/types';

import { CONTEXT } from '~context';

import { TASK_STATUS, TASK_EVENT_TYPES } from '~data/constants';
import {
  createTaskStore,
  getColonyStore,
  getCommentsStore,
  getTaskStore,
  getTaskStoreAddress,
  getCommentsStoreAddress,
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

/*
 * TODO: There's a confusion around query metadata, store metadata, this is a mess!
 * I need to fix that as well but for now I wanna get c/q ready.
 */
type TaskStoreMetadata = {| colonyAddress: Address, draftId: TaskDraftId |};
type CommentsStoreMetadata = TaskStoreMetadata;

const prepareCommentsStoreCommand = async (
  {
    ddb,
  }: {|
    ddb: DDB,
  |},
  metadata: CommentsStoreMetadata,
) => {
  const commentsStoreAddress = await getCommentsStoreAddress(ddb)(metadata);
  return getCommentsStore(ddb)({ ...metadata, commentsStoreAddress });
};

const prepareTaskStoreCommand = async (
  {
    colonyManager,
    ddb,
    wallet,
  }: {|
    colonyManager: ColonyManager,
    ddb: DDB,
    wallet: Wallet,
  |},
  metadata: TaskStoreMetadata,
) => {
  const { colonyAddress } = metadata;
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  const taskStoreAddress = await getTaskStoreAddress(colonyClient, ddb, wallet)(
    metadata,
  );
  return getTaskStore(colonyClient, ddb, wallet)({
    ...metadata,
    taskStoreAddress,
  });
};

// This is not a TaskCommand because we don't yet have a taskStoreAddress
export const createTask: Command<
  {|
    colonyStore: ColonyStore,
    commentsStore: CommentsStore,
    taskStore: TaskStore,
  |},
  TaskStoreMetadata,
  {|
    creatorAddress: string,
    draftId: string,
  |},
  {|
    commentsStore: CommentsStore,
    draftId: TaskDraftId,
    event: Event<typeof TASK_EVENT_TYPES.TASK_CREATED>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  schema: CreateTaskCommandArgsSchema,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
      wallet: Wallet,
    |},
    metadata: TaskStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    const { taskStore, commentsStore } = await createTaskStore(
      colonyClient,
      ddb,
      wallet,
    )(metadata);

    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );

    return {
      colonyStore,
      commentsStore,
      taskStore,
    };
  },
  async execute(
    { colonyStore, commentsStore, taskStore },
    { draftId, creatorAddress },
  ) {
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

    await colonyStore.append(
      createTaskStoreRegisteredEvent({
        commentsStoreAddress,
        draftId,
        taskStoreAddress: taskStore.address.toString(),
      }),
    );

    return {
      commentsStore,
      draftId,
      event: taskStore.getEvent(eventHash),
      taskStore,
    };
  },
};

export const setTaskTitle: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    title: string,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.TASK_TITLE_SET>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskTitleCommandArgsSchema,
  async execute(taskStore, { title }) {
    const eventHash = await taskStore.append(
      createTaskTitleSetEvent({
        title,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const setTaskDescription: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    description: string,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.TASK_DESCRIPTION_SET>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskDescriptionCommandArgsSchema,
  async execute(taskStore, { description }) {
    const eventHash = await taskStore.append(
      createTaskDescriptionSetEvent({
        description,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const setTaskDueDate: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    dueDate: number,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.DUE_DATE_SET>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskDueDateCommandArgsSchema,
  async execute(taskStore, { dueDate }) {
    const eventHash = await taskStore.append(
      createTaskDueDateSetEvent({
        dueDate,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const setTaskSkill: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    skillId: number,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.SKILL_SET>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskSkillCommandArgsSchema,
  async execute(taskStore, { skillId }) {
    const eventHash = await taskStore.append(
      createTaskSkillSetEvent({
        skillId,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const createWorkRequest: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    workerAddress: Address,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.WORK_REQUEST_CREATED>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  async execute(taskStore, { workerAddress }) {
    const eventHash = await taskStore.append(
      createWorkRequestCreatedEvent({
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const sendWorkInvite: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    workerAddress: Address,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.WORK_INVITE_SENT>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SendWorkInviteCommandArgsSchema,
  async execute(taskStore, { workerAddress }) {
    const eventHash = await taskStore.append(
      createWorkInviteSentEvent({
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const postComment: Command<
  CommentsStore,
  CommentsStoreMetadata,
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
  {|
    event: Event<typeof TASK_EVENT_TYPES.COMMENT_POSTED>,
    commentsStore: CommentsStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareCommentsStoreCommand,
  schema: PostCommentCommandArgsSchema,
  async execute(commentsStore, args) {
    const eventHash = await commentsStore.append(
      createCommentPostedEvent(args),
    );
    return { commentsStore, event: commentsStore.getEvent(eventHash) };
  },
};

export const setTaskPayout: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    amount: string,
    token: string,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.PAYOUT_SET>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskPayoutCommandArgsSchema,
  async execute(taskStore, { amount, token }) {
    const eventHash = await taskStore.append(
      createTaskPayoutSetEvent({
        amount,
        token,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const assignWorker: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    workerAddress: Address,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.WORKER_ASSIGNED>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  async execute(taskStore, { workerAddress }) {
    const eventHash = await taskStore.append(
      createWorkerAssignedEvent({
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const unassignWorker: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    workerAddress: Address,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.WORKER_UNASSIGNED>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskPayoutCommandArgsSchema,
  async execute(taskStore, { workerAddress }) {
    const eventHash = await taskStore.append(
      createWorkerUnassignedEvent({
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const finalizeTask: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    workerAddress: Address,
    amountPaid: string,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.TASK_FINALIZED>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: FinalizeTaskCommandArgsSchema,
  async execute(taskStore, { amountPaid, workerAddress }) {
    const eventHash = await taskStore.append(
      createTaskFinalizedEvent({
        amountPaid,
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const cancelTask: Command<
  {| colonyStore: ColonyStore, taskStore: TaskStore |},
  TaskStoreMetadata,
  {|
    draftId: TaskDraftId,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.TASK_CANCELLED>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
      wallet: Wallet,
    |},
    metadata: TaskStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
    });

    const taskStoreAddress = await getTaskStoreAddress(
      colonyClient,
      ddb,
      wallet,
    )(metadata);
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      ...metadata,
      taskStoreAddress,
    });

    return {
      colonyStore,
      taskStore,
    };
  },
  schema: CancelTaskCommandArgsSchema,
  async execute({ colonyStore, taskStore }, { draftId }) {
    const eventHash = await taskStore.append(
      createTaskCancelledEvent({ status: TASK_STATUS.CANCELLED }),
    );
    await colonyStore.append(
      createTaskStoreUnregisteredEvent({
        draftId,
        taskStoreAddress: taskStore.address.toString(),
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const closeTask: Command<
  TaskStore,
  TaskStoreMetadata,
  void,
  {|
    event: Event<typeof TASK_EVENT_TYPES.TASK_CLOSED>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: FinalizeTaskCommandArgsSchema,
  async execute(taskStore) {
    const eventHash = await taskStore.append(
      createTaskClosedEvent({
        status: TASK_STATUS.CLOSED,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const setTaskDomain: Command<
  TaskStore,
  TaskStoreMetadata,
  {|
    domainId: number,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.DOMAIN_SET>,
    taskStore: TaskStore,
  |},
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskDomainCommandArgsSchema,
  async execute(taskStore, { domainId }) {
    const eventHash = await taskStore.append(
      createTaskDomainSetEvent({
        domainId,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};
