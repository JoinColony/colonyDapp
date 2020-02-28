import React from 'react';

import ListGroup, { ListGroupItem } from '~core/ListGroup';
import { OneLevel, OnePersistentTask, useLevelTasksQuery } from '~data/index';

import LevelTaskListItem from './LevelTaskListItem';

interface Props {
  createdTaskId?: OnePersistentTask['id'];
  levelId: OneLevel['id'];
}

const displayName = 'dashboard.LevelTasksEdit.LevelTasksList';

const LeveltasksList = ({ createdTaskId, levelId }: Props) => {
  const { data } = useLevelTasksQuery({ variables: { id: levelId } });
  if (!data) {
    return null;
  }
  const {
    level: { steps: persistentTasks },
  } = data;
  return (
    <ListGroup appearance={{ gaps: 'true' }}>
      {persistentTasks.map(persistentTask => (
        <ListGroupItem key={persistentTask.id}>
          <LevelTaskListItem
            isEditing={persistentTask.id === createdTaskId}
            levelId={levelId}
            persistentTask={persistentTask}
          />
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

LeveltasksList.displayName = displayName;

export default LeveltasksList;
