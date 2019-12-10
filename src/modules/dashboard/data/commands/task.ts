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
  PostCommentCommandArgsSchema,
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
