import BigNumber from 'bn.js';

import { Context } from '~context/index';
import { EventTypes, TaskStates } from '~data/constants';
import {
  ColonyManager,
  Command,
  CommentsStore,
  DDB,
  Event,
  TaskStore,
  Wallet,
} from '~data/types';
import {
  getCommentsStore,
  getTaskStore,
  getTaskStoreAddress,
  getCommentsStoreAddress,
} from '~data/stores';
import { createEvent } from '~data/utils';
import { Address } from '~types/index';

import {
  FinalizeTaskCommandArgsSchema,
  PostCommentCommandArgsSchema,
  SendWorkInviteCommandArgsSchema,
  SetTaskDueDateCommandArgsSchema,
  SetTaskPayoutCommandArgsSchema,
} from './schemas';

/*
 * @todo Better wording for metadata and context
 * @body There's a confusion around query metadata, store metadata, this is a mess!
 */
interface TaskStoreMetadata {
  colonyAddress: Address;
  draftId: string;
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
