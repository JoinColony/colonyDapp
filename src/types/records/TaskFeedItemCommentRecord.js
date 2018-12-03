/* @flow */

import type { RecordOf } from 'immutable';
import type { UserRecord } from './UserRecord';

export type TaskFeedItemCommentProps = {
  body: string,
  user: UserRecord,
};

export type TaskFeedItemCommentRecord = RecordOf<TaskFeedItemCommentProps>;
