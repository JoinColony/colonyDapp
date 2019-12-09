import { CommentEvents } from '~data/types/CommentEvents';
import { TaskEvents } from '~data/types/TaskEvents';
import { Address, AllEvents, Subscription } from '~types/index';
import {
  ColonyManager,
  CommentsStore,
  DDB,
  TaskStore,
  Wallet,
} from '~data/types';

import { Context } from '~context/index';
import {
  getCommentsStore,
  getCommentsStoreAddress,
  getTaskStore,
  getTaskStoreAddress,
} from '~data/stores';

type Metadata = {
  colonyAddress: Address;
  draftId: string;
};
const prepare = async (
  {
    colonyManager,
    ddb,
    wallet,
  }: {
    colonyManager: ColonyManager;
    ddb: DDB;
    wallet: Wallet;
  },
  metadata: Metadata,
) => {
  const { colonyAddress } = metadata;
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  const taskStoreAddress = await getTaskStoreAddress(colonyClient, ddb, wallet)(
    metadata,
  );
  const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
    ...metadata,
    taskStoreAddress,
  });

  const commentsStoreAddress = await getCommentsStoreAddress(ddb)(metadata);
  const commentsStore = await getCommentsStore(ddb)({
    ...metadata,
    commentsStoreAddress,
  });

  return {
    commentsStore,
    taskStore,
  };
};

export const subscribeTaskFeedItems: Subscription<
  { taskStore: TaskStore; commentsStore: CommentsStore },
  Metadata,
  any,
  AllEvents[]
> = {
  name: 'subscribeTaskFeedItems',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare,
  async execute({ commentsStore, taskStore }) {
    // Store previous events for each store so that the events can be combined
    // @todo Simplify and improve performance of task feed items subscription
    let commentsEvents: CommentEvents[] = [];
    let taskEvents: TaskEvents[] = [];

    const emitCombinedEvents = emitter =>
      emitter(
        // Interleave events such that they are sorted chronologically
        [...commentsEvents, ...taskEvents].sort(
          (eventA, eventB) => eventA.meta.timestamp - eventB.meta.timestamp,
        ),
      );

    return emitter => {
      const commentsSub = commentsStore.subscribe(events => {
        commentsEvents = events;
        emitCombinedEvents(emitter);
      });

      const taskSub = taskStore.subscribe(events => {
        taskEvents = events;
        emitCombinedEvents(emitter);
      });

      return [commentsSub, taskSub];
    };
  },
};
