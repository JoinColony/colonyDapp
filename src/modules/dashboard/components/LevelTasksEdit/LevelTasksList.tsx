import React from 'react';

import ListGroup, { ListGroupItem } from '~core/ListGroup';
import { OneLevel, OnePersistentTask } from '~data/index';

import LevelTaskListItem from './LevelTaskListItem';

interface Props {
  createdTaskId?: OnePersistentTask['id'];
  levelId: OneLevel['id'];
  levelSteps: OneLevel['steps'];
}

const displayName = 'dashboard.LevelTasksEdit.LevelTasksList';

const LeveltasksList = ({ createdTaskId, levelId, levelSteps }: Props) => (
  <ListGroup appearance={{ gaps: 'true' }}>
    {levelSteps.map(persistentTask => (
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

LeveltasksList.displayName = displayName;

export default LeveltasksList;
