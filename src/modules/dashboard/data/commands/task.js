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

import {
  TASK_STATUS,
  TASK_EVENT_TYPES,
  COLONY_EVENT_TYPES,
} from '~data/constants';
import {
  createTaskStore,
  getColonyStore,
  getCommentsStore,
  getTaskStore,
  getTaskStoreAddress,
  getCommentsStoreAddress,
} from '~data/stores';
import { createEvent } from '~data/utils';

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
 * @todo Better wording for metadata and context
 * @body There's a confusion around query metadata, store metadata, this is a mess!
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

export const createTask: Command<
  {|
    colonyStore: ColonyStore,
    commentsStore: CommentsStore,
    taskStore: TaskStore,
  |},
  TaskStoreMetadata,
  {|
    creatorAddress: Address,
    draftId: string,
  |},
  {|
    commentsStore: CommentsStore,
    draftId: TaskDraftId,
    event: Event<typeof TASK_EVENT_TYPES.TASK_CREATED>,
    taskStore: TaskStore,
  |},
> = {
  name: 'createTask',
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
      createEvent(TASK_EVENT_TYPES.COMMENT_STORE_CREATED, {
        commentsStoreAddress,
      }),
    );

    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.TASK_CREATED, {
        creatorAddress,
        draftId,
      }),
    );

    await colonyStore.append(
      createEvent(COLONY_EVENT_TYPES.TASK_STORE_REGISTERED, {
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
  name: 'setTaskTitle',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskTitleCommandArgsSchema,
  async execute(taskStore, { title }) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.TASK_TITLE_SET, {
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
  name: 'setTaskDescription',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskDescriptionCommandArgsSchema,
  async execute(taskStore, { description }) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.TASK_DESCRIPTION_SET, {
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
  name: 'setTaskDueDate',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskDueDateCommandArgsSchema,
  async execute(taskStore, { dueDate }) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.DUE_DATE_SET, {
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
  name: 'setTaskSkill',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskSkillCommandArgsSchema,
  async execute(taskStore, { skillId }) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.SKILL_SET, {
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
  name: 'createWorkRequest',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  async execute(taskStore, { workerAddress }) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.WORK_REQUEST_CREATED, {
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
  name: 'sendWorkInvite',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SendWorkInviteCommandArgsSchema,
  async execute(taskStore, { workerAddress }) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.WORK_INVITE_SENT, {
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
    |},
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.COMMENT_POSTED>,
    commentsStore: CommentsStore,
  |},
> = {
  name: 'postComment',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareCommentsStoreCommand,
  schema: PostCommentCommandArgsSchema,
  async execute(commentsStore, args) {
    const eventHash = await commentsStore.append(
      createEvent(TASK_EVENT_TYPES.COMMENT_POSTED, args),
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
  name: 'setTaskPayout',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskPayoutCommandArgsSchema,
  async execute(taskStore, { amount, token }) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.PAYOUT_SET, {
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
    currentWorkerAddress: ?Address,
  |},
  ?{|
    event: Event<typeof TASK_EVENT_TYPES.WORKER_ASSIGNED>,
    taskStore: TaskStore,
  |},
> = {
  name: 'assignWorker',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  async execute(taskStore, { workerAddress, currentWorkerAddress }) {
    if (workerAddress === currentWorkerAddress) {
      return null;
    }
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.WORKER_ASSIGNED, {
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
  name: 'unassignWorker',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskPayoutCommandArgsSchema,
  async execute(taskStore, { workerAddress }) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.WORKER_UNASSIGNED, {
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
    amountPaid: string,
    paymentTokenAddress?: Address,
    workerAddress: Address,
  |},
  {|
    event: Event<typeof TASK_EVENT_TYPES.TASK_FINALIZED>,
    taskStore: TaskStore,
  |},
> = {
  name: 'finalizeTask',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: FinalizeTaskCommandArgsSchema,
  async execute(taskStore, args) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.TASK_FINALIZED, args),
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
  name: 'cancelTask',
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
      createEvent(TASK_EVENT_TYPES.TASK_CANCELLED, {
        status: TASK_STATUS.CANCELLED,
      }),
    );
    await colonyStore.append(
      createEvent(COLONY_EVENT_TYPES.TASK_STORE_UNREGISTERED, {
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
  name: 'closeTask',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: FinalizeTaskCommandArgsSchema,
  async execute(taskStore) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.TASK_CLOSED, {
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
  name: 'setTaskDomain',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskDomainCommandArgsSchema,
  async execute(taskStore, { domainId }) {
    const eventHash = await taskStore.append(
      createEvent(TASK_EVENT_TYPES.DOMAIN_SET, {
        domainId,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};
