/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { TaskFeedItemProps } from '~types';

const defaultValues: TaskFeedItemProps = {
  comment: undefined,
  createdAt: new Date(),
  id: 0,
  rating: undefined,
};

const TaskFeedItem: RecordFactory<TaskFeedItemProps> = Record(defaultValues);

export default TaskFeedItem;
