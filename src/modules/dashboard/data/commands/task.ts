import BigNumber from 'bn.js';

import { Address } from '~types/index';
import { TaskDraftId } from '~immutable/index';
import {
  CommentsStore,
  ColonyManager,
  ColonyStore,
  ColonyTaskIndexStore,
  Command,
  DDB,
  Event,
  TaskStore,
  Wallet,
} from '~data/types';
import { Context } from '~context/index';
import { TaskStates, EventTypes } from '~data/constants';
import {
  createTaskStore,
  getColonyStore,
  getColonyTaskIndexStore,
  getCommentsStore,
  getTaskStore,
  getColonyTaskIndexStoreAddress,
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
type TaskStoreMetadata = { colonyAddress: Address; draftId: TaskDraftId };
type CommentsStoreMetadata = TaskStoreMetadata;

const prepareCommentsStoreCommand = async (
  {
    ddb,
  }: {
    ddb: DDB;
  },
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
  }: {
    colonyManager: ColonyManager;
    ddb: DDB;
    wallet: Wallet;
  },
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
  {
    colonyTaskIndexStore: ColonyTaskIndexStore | null;
    colonyStore: ColonyStore | null;
    commentsStore: CommentsStore;
    taskStore: TaskStore;
  },
  TaskStoreMetadata,
  {
    creatorAddress: Address;
    draftId: string;
  },
  {
    commentsStore: CommentsStore;
    draftId: TaskDraftId;
    event: Event<EventTypes.TASK_CREATED>;
    taskStore: TaskStore;
  }
> = {
  name: 'createTask',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  schema: CreateTaskCommandArgsSchema,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {
      colonyManager: ColonyManager;
      ddb: DDB;
      wallet: Wallet;
    },
    metadata: TaskStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    const { taskStore, commentsStore } = await createTaskStore(
      colonyClient,
      ddb,
      wallet,
    )(metadata);
    const colonyTaskIndexStoreAddress = await getColonyTaskIndexStoreAddress(
      colonyClient,
      ddb,
      wallet,
    )(metadata);
    const colonyTaskIndexStore = await getColonyTaskIndexStore(
      colonyClient,
      ddb,
      wallet,
    )({ colonyAddress, colonyTaskIndexStoreAddress });

    // backwards-compatibility Colony task index store
    let colonyStore;
    if (!colonyTaskIndexStore) {
      colonyStore = await getColonyStore(colonyClient, ddb, wallet)(metadata);
    }

    if (!(colonyStore || colonyTaskIndexStore)) {
      throw new Error(
        'Could not load colony task index or colony store either',
      );
    }
    return {
      colonyTaskIndexStore,
      colonyStore,
      commentsStore,
      taskStore,
    };
  },
  async execute(
    { colonyTaskIndexStore, colonyStore, commentsStore, taskStore },
    { draftId, creatorAddress },
  ) {
    // backwards-compatibility Colony task index store
    if (!colonyStore || !colonyTaskIndexStore) {
      throw new Error('Couldnt locate the store to register this task');
    }

    const commentsStoreAddress = commentsStore.address.toString();
    await taskStore.init(
      createEvent(EventTypes.COMMENT_STORE_CREATED, {
        commentsStoreAddress,
      }),
    );

    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_CREATED, {
        creatorAddress,
        draftId,
      }),
    );

    const event = createEvent(EventTypes.TASK_STORE_REGISTERED, {
      commentsStoreAddress,
      draftId,
      taskStoreAddress: taskStore.address.toString(),
    });

    // backwards-compatibility Colony task index store
    const taskIndexStore = colonyTaskIndexStore || colonyStore;
    await taskIndexStore.append(event);

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
  {
    currentTitle: string | void;
    title: string;
  },
  {
    event: Event<EventTypes.TASK_TITLE_SET>;
    taskStore: TaskStore;
  } | null
> = {
  name: 'setTaskTitle',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskTitleCommandArgsSchema,
  async execute(taskStore, { currentTitle, title }) {
    if (title === currentTitle) return null;
    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_TITLE_SET, {
        title,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const setTaskDescription: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    currentDescription: string | void;
    description: string;
  },
  {
    event: Event<EventTypes.TASK_DESCRIPTION_SET>;
    taskStore: TaskStore;
  } | null
> = {
  name: 'setTaskDescription',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskDescriptionCommandArgsSchema,
  async execute(taskStore, { currentDescription, description }) {
    if (description === currentDescription) {
      return null;
    }
    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_DESCRIPTION_SET, {
        description,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const setTaskDueDate: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    dueDate?: number;
  },
  {
    event: Event<EventTypes.DUE_DATE_SET>;
    taskStore: TaskStore;
  }
> = {
  name: 'setTaskDueDate',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskDueDateCommandArgsSchema,
  async execute(taskStore, { dueDate }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.DUE_DATE_SET, {
        dueDate,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const setTaskSkill: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    skillId?: number;
  },
  {
    event: Event<EventTypes.SKILL_SET>;
    taskStore: TaskStore;
  }
> = {
  name: 'setTaskSkill',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskSkillCommandArgsSchema,
  async execute(taskStore, { skillId }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.SKILL_SET, {
        skillId,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const createWorkRequest: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    workerAddress: Address;
  },
  {
    event: Event<EventTypes.WORK_REQUEST_CREATED>;
    taskStore: TaskStore;
  }
> = {
  name: 'createWorkRequest',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  async execute(taskStore, { workerAddress }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.WORK_REQUEST_CREATED, {
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const sendWorkInvite: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    workerAddress: Address;
  },
  {
    event: Event<EventTypes.WORK_INVITE_SENT>;
    taskStore: TaskStore;
  }
> = {
  name: 'sendWorkInvite',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SendWorkInviteCommandArgsSchema,
  async execute(taskStore, { workerAddress }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.WORK_INVITE_SENT, {
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const postComment: Command<
  CommentsStore,
  CommentsStoreMetadata,
  {
    signature: string;
    content: {
      id: string;

      /*
       * The author's address is passed explicitly in the arguments (as opposed
       * to using `event.meta.userAddress`) because it gets signed alongside
       * all of the other comment data (since it is a permissive store).
       */
      author: Address;
      body: string;
    };
  },
  {
    event: Event<EventTypes.COMMENT_POSTED>;
    commentsStore: CommentsStore;
  }
> = {
  name: 'postComment',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareCommentsStoreCommand,
  schema: PostCommentCommandArgsSchema,
  async execute(commentsStore, args) {
    const eventHash = await commentsStore.append(
      createEvent(EventTypes.COMMENT_POSTED, args),
    );
    return { commentsStore, event: commentsStore.getEvent(eventHash) };
  },
};

export const setTaskPayout: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    amount: BigNumber;
    token: string;
  },
  {
    event: Event<EventTypes.PAYOUT_SET>;
    taskStore: TaskStore;
  }
> = {
  name: 'setTaskPayout',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskPayoutCommandArgsSchema,
  async execute(taskStore, { amount, token }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.PAYOUT_SET, {
        amount: amount.toString(10),
        token,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const removeTaskPayout: Command<
  TaskStore,
  TaskStoreMetadata,
  void,
  {
    event: Event<EventTypes.PAYOUT_REMOVED>;
    taskStore: TaskStore;
  }
> = {
  name: 'removeTaskPayout',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  async execute(taskStore) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.PAYOUT_REMOVED),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const assignWorker: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    workerAddress: Address;
    currentWorkerAddress: Address | null;
  },
  {
    event: Event<EventTypes.WORKER_ASSIGNED>;
    taskStore: TaskStore;
  } | null
> = {
  name: 'assignWorker',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  async execute(taskStore, { workerAddress, currentWorkerAddress }) {
    if (workerAddress === currentWorkerAddress) {
      return null;
    }
    const eventHash = await taskStore.append(
      createEvent(EventTypes.WORKER_ASSIGNED, {
        workerAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const unassignWorker: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    workerAddress: Address;
    userAddress: Address;
  },
  {
    event: Event<EventTypes.WORKER_UNASSIGNED>;
    taskStore: TaskStore;
  }
> = {
  name: 'unassignWorker',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  async execute(taskStore, { workerAddress, userAddress }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.WORKER_UNASSIGNED, {
        workerAddress,
        userAddress,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const finalizeTask: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    amountPaid: string;
    paymentTokenAddress?: Address;
    workerAddress: Address;
    transactionHash: string;
  },
  {
    event: Event<EventTypes.TASK_FINALIZED>;
    taskStore: TaskStore;
  }
> = {
  name: 'finalizeTask',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: FinalizeTaskCommandArgsSchema,
  async execute(taskStore, args) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_FINALIZED, args),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const cancelTask: Command<
  {
    colonyStore: ColonyStore | null;
    colonyTaskIndexStore: ColonyTaskIndexStore | null;
    taskStore: TaskStore;
  },
  TaskStoreMetadata,
  {
    draftId: TaskDraftId;
  },
  {
    event: Event<EventTypes.TASK_CANCELLED>;
    taskStore: TaskStore;
  }
> = {
  name: 'cancelTask',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {
      colonyManager: ColonyManager;
      ddb: DDB;
      wallet: Wallet;
    },
    metadata: TaskStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    const colonyTaskIndexStoreAddress = await getColonyTaskIndexStoreAddress(
      colonyClient,
      ddb,
      wallet,
    )(metadata);
    const colonyTaskIndexStore = await getColonyTaskIndexStore(
      colonyClient,
      ddb,
      wallet,
    )({ colonyAddress, colonyTaskIndexStoreAddress });

    // backwards-compatibility Colony task index store
    let colonyStore;
    if (!colonyTaskIndexStore) {
      colonyStore = await getColonyStore(colonyClient, ddb, wallet)(metadata);
    }

    if (!colonyStore || !colonyTaskIndexStore) {
      throw new Error(
        'Could not load colony task index or colony store either',
      );
    }

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
      colonyTaskIndexStore,
      taskStore,
    };
  },
  schema: CancelTaskCommandArgsSchema,
  async execute({ colonyStore, colonyTaskIndexStore, taskStore }, { draftId }) {
    if (!colonyStore || !colonyTaskIndexStore) {
      throw new Error(
        'Could not load colony task index or colony store either',
      );
    }
    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_CANCELLED, {
        status: TaskStates.CANCELLED,
      }),
    );

    // backwards-compatibility Colony task index store
    const taskIndexStore = colonyTaskIndexStore || colonyStore;
    await taskIndexStore.append(
      createEvent(EventTypes.TASK_STORE_UNREGISTERED, {
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
  {
    event: Event<EventTypes.TASK_CLOSED>;
    taskStore: TaskStore;
  }
> = {
  name: 'closeTask',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: FinalizeTaskCommandArgsSchema,
  async execute(taskStore) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_CLOSED, {
        status: TaskStates.CLOSED,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};

export const setTaskDomain: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    domainId: number;
  },
  {
    event: Event<EventTypes.DOMAIN_SET>;
    taskStore: TaskStore;
  }
> = {
  name: 'setTaskDomain',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: SetTaskDomainCommandArgsSchema,
  async execute(taskStore, { domainId }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.DOMAIN_SET, {
        domainId,
      }),
    );
    return { taskStore, event: taskStore.getEvent(eventHash) };
  },
};
