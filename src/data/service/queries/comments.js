/* @flow */

import type { OrbitDBAddress } from '~types';

import type {
  ContextWithMetadata,
  DDBContext,
  Event,
  Query,
} from '~data/types';

import { getCommentsStore } from '~data/stores';
import { TASK_EVENT_TYPES } from '~data/constants';

const { COMMENT_POSTED } = TASK_EVENT_TYPES;

export type CommentQueryContext = ContextWithMetadata<
  {|
    commentsStoreAddress: string | OrbitDBAddress,
  |},
  DDBContext,
>;

export type CommentQuery<I: *, R: *> = Query<CommentQueryContext, I, R>;

// eslint-disable-next-line import/prefer-default-export
export const getTaskComments: CommentQuery<*, *> = ({
  ddb,
  metadata: { commentsStoreAddress },
}) => ({
  async execute() {
    const commentsStore = await getCommentsStore(ddb)({
      commentsStoreAddress,
    });
    return commentsStore
      .all()
      .filter(({ type }) => type === COMMENT_POSTED)
      .map(({ payload }: Event<typeof COMMENT_POSTED>) => payload);
  },
});
