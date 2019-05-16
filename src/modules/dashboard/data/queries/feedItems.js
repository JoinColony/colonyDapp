/* @flow */

import type { Address, $Pick } from '~types';
import type { TaskDraftId } from '~immutable';
import type {
  ColonyManager,
  CommentsStore,
  DDB,
  Event,
  Query,
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
import { TASK_EVENT_TYPES } from '~data/constants';

const {
  COMMENT_POSTED,
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
} = TASK_EVENT_TYPES;

export type TaskFeedItemEvents = $Values<
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

const FEED_ITEM_TYPES = [
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
];

// eslint-disable-next-line import/prefer-default-export
export const getTaskFeedItems: Query<
  {| taskStore: TaskStore, commentsStore: CommentsStore |},
  Metadata,
  void,
  TaskFeedItemEvents[],
> = {
  name: 'getTaskFeedItems',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare,
  async execute({ commentsStore, taskStore }) {
    const commentEvents: Event<
      typeof COMMENT_POSTED,
    >[] = commentsStore.all().filter(({ type }) => type === COMMENT_POSTED);

    const taskEvents: TaskFeedItemEvents[] = taskStore
      .all()
      // Include only events we can treat as feed items
      .filter(({ type }) => FEED_ITEM_TYPES.includes(type));

    return [...commentEvents, ...taskEvents].sort(
      (a, b) => a.meta.timestamp - b.meta.timestamp,
    );
  },
};
