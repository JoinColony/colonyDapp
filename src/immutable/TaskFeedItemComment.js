/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import User from './User';

import type { UserRecord } from './User';

export type TaskFeedItemCommentProps = {
  body: string,
  user: UserRecord,
};

export type TaskFeedItemCommentRecord = RecordOf<TaskFeedItemCommentProps>;

const defaultValues: TaskFeedItemCommentProps = {
  body: '',
  user: User(),
};

const TaskFeedItemComment: RecordFactory<TaskFeedItemCommentProps> = Record(
  defaultValues,
);

export default TaskFeedItemComment;
