/* @flow */

import type { Address, $Pick, Event, Subscription } from '~types';
import type { TaskDraftId } from '~immutable';
import type {
  ColonyManager,
  CommentsStore,
  DDB,
  TaskStore,
  Wallet,
} from '~data/types';
import type { TaskEvents } from '~data/types/TaskEvents';

import { CONTEXT } from '~context';
import {
  getCommentsStore,
  getCommentsStoreAddress,
  getTaskStore,
  getTaskStoreAddress,
} from '~data/stores';

export type AllTaskEvents = $Values<
  $Pick<
    TaskEvents,
    {|
      COMMENT_POSTED: *,
      DOMAIN_SET: *,
      DUE_DATE_SET: *,
      PAYOUT_SET: *,
      SKILL_SET: *,
      TASK_CANCELLED: *,
      TASK_CLOSED: *,
      TASK_CREATED: *,
      TASK_DESCRIPTION_SET: *,
      TASK_FINALIZED: *,
      TASK_TITLE_SET: *,
      WORK_INVITE_SENT: *,
      WORK_REQUEST_CREATED: *,
      WORKER_ASSIGNED: *,
      WORKER_UNASSIGNED: *,
    |},
  >,
>;

type Metadata = {|
  colonyAddress: Address,
  draftId: TaskDraftId,
|};
const prepare = async (
  {
    colonyManager,
    ddb,
    wallet,
  }: {|
    colonyManager: ColonyManager,
    ddb: DDB,
    wallet: Wallet,
  |},
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

// eslint-disable-next-line import/prefer-default-export
export const subscribeTaskFeedItems: Subscription<
  {| taskStore: TaskStore, commentsStore: CommentsStore |},
  Metadata,
  void,
  AllTaskEvents[],
> = {
  name: 'subscribeTaskFeedItems',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare,
  async createSubscription({ commentsStore, taskStore }) {
    // Store previous events for each store so that the events can be combined
    // @todo Simplify and improve performance of task feed items subscription
    let commentsEvents: Event<*> = [];
    let taskEvents: Event<*> = [];

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
