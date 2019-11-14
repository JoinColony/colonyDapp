import BigNumber from 'bn.js';

import { ROLES } from '~constants';
import { Context } from '~context/index';
import { EventTypes, TaskStates, Versions } from '~data/constants';
import {
  ColonyManager,
  ColonyStore,
  ColonyTaskIndexStore,
  Command,
  CommentsStore,
  DDB,
  Event,
  TaskStore,
  VersionedEvent,
  Wallet,
} from '~data/types';
import {
  createTaskStore,
  getColonyTaskStores,
  getCommentsStore,
  getTaskStore,
  getTaskStoreAddress,
  getCommentsStoreAddress,
} from '~data/stores';
import { createEvent } from '~data/utils';
import { TaskDraftId } from '~immutable/index';
import { Address, ColonyClient } from '~types/index';

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
interface TaskStoreMetadata {
  colonyAddress: Address;
  draftId: TaskDraftId;
}

interface CreateTaskStoreMetadata extends TaskStoreMetadata {
  domainId: number;
}

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
  CreateTaskStoreMetadata,
  {
    creatorAddress: Address;
    draftId: string;
    domainId: number;
  },
  {
    commentsStore: CommentsStore;
    draftId: TaskDraftId;
    domainId: number;
    event: Event<EventTypes.TASK_CREATED>;
    taskStore: TaskStore;
  }
> = {
  name: 'createTask',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  schema: CreateTaskCommandArgsSchema,
  async prepare({ colonyManager, ddb, wallet }, metadata) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);

    const { taskStore, commentsStore } = await createTaskStore(
      colonyClient,
      ddb,
      wallet,
    )(metadata);

    const { colonyTaskIndexStore, colonyStore } = await getColonyTaskStores(
      { colonyClient, ddb, wallet },
      metadata,
    );

    return {
      colonyTaskIndexStore,
      colonyStore,
      commentsStore,
      taskStore,
    };
  },
  async execute(
    { colonyTaskIndexStore, colonyStore, commentsStore, taskStore },
    { draftId, domainId, creatorAddress },
  ) {
    // backwards-compatibility Colony task index store
    const taskIndexStore = colonyTaskIndexStore || colonyStore;
    if (!taskIndexStore) {
      throw new Error('Couldnt locate the store to register this task');
    }

    const commentsStoreAddress = commentsStore.address.toString();
    await taskStore.append(
      createEvent(EventTypes.COMMENT_STORE_CREATED, {
        commentsStoreAddress,
        domainId,
      }),
    );

    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_CREATED, {
        creatorAddress,
        draftId,
        domainId,
      }),
    );

    const event = createEvent(EventTypes.TASK_STORE_REGISTERED, {
      commentsStoreAddress,
      draftId,
      taskStoreAddress: taskStore.address.toString(),
    });

    await taskIndexStore.append(event);

    return {
      commentsStore,
      draftId,
      domainId,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.TASK_CREATED>,
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
    domainId: number;
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
  async execute(taskStore, { currentTitle, title, domainId }) {
    if (title === currentTitle) return null;
    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_TITLE_SET, {
        title,
        domainId,
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.TASK_TITLE_SET>,
    };
  },
};

export const setTaskDescription: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    currentDescription: string | void;
    description: string;
    domainId: number;
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
  async execute(taskStore, { currentDescription, description, domainId }) {
    if (description === currentDescription) {
      return null;
    }
    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_DESCRIPTION_SET, {
        description,
        domainId,
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<
        EventTypes.TASK_DESCRIPTION_SET
      >,
    };
  },
};

export const setTaskDueDate: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    dueDate?: number;
    domainId: number;
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
  async execute(taskStore, { dueDate, domainId }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.DUE_DATE_SET, {
        dueDate,
        domainId,
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.DUE_DATE_SET>,
    };
  },
};

export const setTaskSkill: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    skillId?: number;
    domainId: number;
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
  async execute(taskStore, { skillId, domainId }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.SKILL_SET, {
        skillId,
        domainId,
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.SKILL_SET>,
    };
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
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<
        EventTypes.WORK_REQUEST_CREATED
      >,
    };
  },
};

export const sendWorkInvite: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    workerAddress: Address;
    domainId: number;
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
  async execute(taskStore, { workerAddress, domainId }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.WORK_INVITE_SENT, {
        workerAddress,
        domainId,
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<
        EventTypes.WORK_INVITE_SENT
      >,
    };
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
    return {
      commentsStore,
      event: commentsStore.getEvent(eventHash) as Event<
        EventTypes.COMMENT_POSTED
      >,
    };
  },
};

export const setTaskPayout: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    amount: BigNumber;
    token: string;
    domainId: number;
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
  async execute(taskStore, { amount, token, domainId }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.PAYOUT_SET, {
        amount: amount.toString(10),
        token,
        domainId,
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.PAYOUT_SET>,
    };
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
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.PAYOUT_REMOVED>,
    };
  },
};

export const assignWorker: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    workerAddress: Address;
    currentWorkerAddress: Address | null;
    domainId: number;
  },
  {
    event: Event<EventTypes.WORKER_ASSIGNED>;
    taskStore: TaskStore;
  } | null
> = {
  name: 'assignWorker',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  async execute(taskStore, { workerAddress, currentWorkerAddress, domainId }) {
    if (workerAddress === currentWorkerAddress) {
      return null;
    }
    const eventHash = await taskStore.append(
      createEvent(EventTypes.WORKER_ASSIGNED, {
        workerAddress,
        domainId,
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.WORKER_ASSIGNED>,
    };
  },
};

export const unassignWorker: Command<
  TaskStore,
  TaskStoreMetadata,
  {
    workerAddress: Address;
    userAddress: Address;
    domainId: number;
  },
  {
    event: Event<EventTypes.WORKER_UNASSIGNED>;
    taskStore: TaskStore;
  }
> = {
  name: 'unassignWorker',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  async execute(taskStore, { workerAddress, userAddress, domainId }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.WORKER_UNASSIGNED, {
        workerAddress,
        userAddress,
        domainId,
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<
        EventTypes.WORKER_UNASSIGNED
      >,
    };
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
    domainId: number;
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
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.TASK_FINALIZED>,
    };
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
    domainId: number;
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

    const taskStoreAddress = await getTaskStoreAddress(
      colonyClient,
      ddb,
      wallet,
    )(metadata);
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      ...metadata,
      taskStoreAddress,
    });

    const { colonyTaskIndexStore, colonyStore } = await getColonyTaskStores(
      { colonyClient, ddb, wallet },
      metadata,
    );

    return {
      colonyStore,
      colonyTaskIndexStore,
      taskStore,
    };
  },
  schema: CancelTaskCommandArgsSchema,
  async execute(
    { colonyStore, colonyTaskIndexStore, taskStore },
    { draftId, domainId },
  ) {
    // backwards-compatibility Colony task index store
    const store = colonyTaskIndexStore || colonyStore;
    if (!store) {
      throw new Error(
        'Could not load colony task index or colony store either',
      );
    }
    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_CANCELLED, {
        status: TaskStates.CANCELLED,
        domainId,
      }),
    );
    await store.append(
      createEvent(EventTypes.TASK_STORE_UNREGISTERED, {
        draftId,
        taskStoreAddress: taskStore.address.toString(),
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.TASK_CANCELLED>,
    };
  },
};

export const closeTask: Command<
  TaskStore,
  TaskStoreMetadata,
  { domainId: number },
  {
    event: Event<EventTypes.TASK_CLOSED>;
    taskStore: TaskStore;
  }
> = {
  name: 'closeTask',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreCommand,
  schema: FinalizeTaskCommandArgsSchema,
  async execute(taskStore, { domainId }) {
    const eventHash = await taskStore.append(
      createEvent(EventTypes.TASK_CLOSED, {
        status: TaskStates.CLOSED,
        domainId,
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.TASK_CLOSED>,
    };
  },
};

export const setTaskDomain: Command<
  { taskStore: TaskStore; colonyClient: ColonyClient; walletAddress: Address },
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
  async prepare({ colonyManager, ddb, wallet }, metadata) {
    const colonyClient = await colonyManager.getColonyClient(
      metadata.colonyAddress,
    );
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
      colonyClient,
      taskStore,
      walletAddress: wallet.address,
    };
  },
  schema: SetTaskDomainCommandArgsSchema,
  async execute({ colonyClient, taskStore, walletAddress }, { domainId }) {
    /*
     * @todo: Check current domain permissions in the task access controller when setting a domain
     */
    const canAppend = await (async (): Promise<boolean> => {
      const {
        payload: { domainId: currentDomainId },
      } = taskStore
        .all()
        .filter(
          ({ type }) =>
            type === EventTypes.TASK_CREATED || type === EventTypes.DOMAIN_SET,
        )
        .pop() as VersionedEvent<
        Versions.CURRENT,
        EventTypes.TASK_CREATED | EventTypes.DOMAIN_SET
      >;

      const {
        hasRole: isAdminOfCurrentDomain,
      } = await colonyClient.hasColonyRole.call({
        address: walletAddress,
        role: ROLES.ADMINISTRATION,
        domainId: currentDomainId,
      });

      const {
        hasRole: isAdminOfNextDomain,
      } = await colonyClient.hasColonyRole.call({
        address: walletAddress,
        role: ROLES.ADMINISTRATION,
        domainId,
      });
      return isAdminOfCurrentDomain && isAdminOfNextDomain;
    })();

    if (!canAppend) {
      throw new Error(
        'Unable to set domain; not an admin of the current domain',
      );
    }

    const eventHash = await taskStore.append(
      createEvent(EventTypes.DOMAIN_SET, {
        domainId,
      }),
    );
    return {
      taskStore,
      event: taskStore.getEvent(eventHash) as Event<EventTypes.DOMAIN_SET>,
    };
  },
};
