import React from 'react';

import { OnePersistentTask } from '~data/index';

interface Props {
  persistentTask: OnePersistentTask;
}

const displayName = 'dashboard.LevelTasksEdit.LevelTaskListItem';

const LevelTaskListItem = ({ persistentTask }: Props) => (
  <div>{persistentTask.id}</div>
);

LevelTaskListItem.displayName = displayName;

export default LevelTaskListItem;
