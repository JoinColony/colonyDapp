import React from 'react';

import ListGroup, { ListGroupItem } from '~core/ListGroup';
import { OneLevel, useLevelTasksQuery } from '~data/index';

import LevelTaskListItem from './LevelTaskListItem';

interface Props {
  levelId: OneLevel['id'];
}

const displayName = 'dashboard.LevelTasksEdit.LevelTasksList';

const LeveltasksList = ({ levelId }: Props) => {
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
