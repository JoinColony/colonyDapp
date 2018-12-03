/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import User from './User';

import type { TaskFeedItemCommentProps } from '~types';

const defaultValues: TaskFeedItemCommentProps = {
  body: '',
  user: User(),
};

const TaskFeedItemComment: RecordFactory<TaskFeedItemCommentProps> = Record(
  defaultValues,
);

export default TaskFeedItemComment;
