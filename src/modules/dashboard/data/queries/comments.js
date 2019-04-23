/* @flow */

import type { TaskDraftId } from '~immutable';
import type { Address, OrbitDBAddress } from '~types';

import type { ContextWithMetadata, DDBContext, Query } from '~data/types';

import { getCommentsStore } from '~data/stores';
import { TASK_EVENT_TYPES } from '~data/constants';

const { COMMENT_POSTED } = TASK_EVENT_TYPES;

export type CommentQueryContext = ContextWithMetadata<
  {|
    colonyAddress: Address,
    commentsStoreAddress: string | OrbitDBAddress,
    draftId: TaskDraftId,
  |},
  DDBContext,
>;

export type CommentQuery<I: *, R: *> = Query<CommentQueryContext, I, R>;

// TODO in #580 replace with fetching feed items
// eslint-disable-next-line import/prefer-default-export
export const getTaskComments: CommentQuery<*, *> = ({
  ddb,
  metadata: { colonyAddress, commentsStoreAddress, draftId },
}) => ({
  async execute() {
    const commentsStore = await getCommentsStore(ddb)({
      colonyAddress,
      commentsStoreAddress,
      draftId,
    });
    return commentsStore.all().filter(({ type }) => type === COMMENT_POSTED);
  },
});
