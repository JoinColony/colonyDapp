/* @flow */

import type { RecordOf } from 'immutable';
import type { UserRecord } from './UserRecord';

export type TaskFeedItemRatingProps = {|
  ratee: UserRecord,
  rater: UserRecord,
  rating: number,
|};

export type TaskFeedItemRatingRecord = RecordOf<TaskFeedItemRatingProps>;
