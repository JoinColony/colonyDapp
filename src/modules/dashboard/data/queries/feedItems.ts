import { Address, Subscription, AllEvents } from '~types/index';
import { TaskDraftId } from '~immutable/index';
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
  draftId: TaskDraftId;
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
    let commentsEvents: AllEvents[] = [];
    let taskEvents: AllEvents[] = [];

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
