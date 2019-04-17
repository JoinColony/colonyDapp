/* @flow */

import type { Address, OrbitDBAddress, $Pick } from '~types';
import type { TaskDraftId } from '~immutable';
import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  Event,
  Query,
  WalletContext,
} from '~data/types';
import type { TaskEvents } from '~data/types/TaskEvents';

import { getCommentsStore, getTaskStore } from '~data/stores';
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

export type FeedItemsQueryContext = ContextWithMetadata<
  {|
    colonyAddress: Address,
    commentsStoreAddress: string | OrbitDBAddress,
    draftId: TaskDraftId,
    taskStoreAddress: string | OrbitDBAddress,
  |},
  DDBContext & ColonyClientContext & WalletContext,
>;

export type FeedItemsQuery<I: *, R: *> = Query<FeedItemsQueryContext, I, R>;

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

// eslint-disable-next-line import/prefer-default-export
export const getTaskFeedItems: FeedItemsQuery<void, TaskFeedItemEvents[]> = ({
  colonyClient,
  ddb,
  wallet,
  metadata,
}) => ({
  async execute() {
    const commentsStore = await getCommentsStore(ddb)(metadata);
    const commentEvents: Event<
      typeof COMMENT_POSTED,
    >[] = commentsStore.all().filter(({ type }) => type === COMMENT_POSTED);

    const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);

    // Include only events we can treat as feed items
    const feedItemTypes = [
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

    const taskEvents: TaskFeedItemEvents[] = taskStore
      .all()
      .filter(({ type }) => feedItemTypes.includes(type));

    return [...commentEvents, ...taskEvents].sort(
      (a, b) => a.meta.timestamp - b.meta.timestamp,
    );
  },
});
