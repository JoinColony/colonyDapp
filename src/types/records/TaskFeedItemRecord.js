/* @flow */

import type { RecordOf } from 'immutable';

import type {
  TaskFeedItemCommentRecord,
  TaskFeedItemRatingRecord,
} from '~types';

export type TaskFeedItemProps = {
  id: number,
  createdAt: Date,
  comment?: TaskFeedItemCommentRecord,
  rating?: TaskFeedItemRatingRecord,
};

export type TaskFeedItemRecord = RecordOf<TaskFeedItemProps>;
