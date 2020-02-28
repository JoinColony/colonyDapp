import React from 'react';
import { defineMessages } from 'react-intl';

import { DottedAddButton } from '~core/Button';
import {
  useCreateLevelTaskMutation,
  OneLevel,
  cacheUpdates,
} from '~data/index';

import LevelTasksList from './LevelTasksList';

import styles from './LevelTasksEdit.css';

const MSG = defineMessages({
  buttonAddPersistentTask: {
    id: 'dashboard.LevelTasksEdit.buttonAddPersistentTask',
    defaultMessage: 'Add task',
  },
});

interface Props {
  levelId: OneLevel['id'];
}

const displayName = 'dashboard.LevelTasksEdit';

const LevelTasksEdit = ({ levelId }: Props) => {
  const [createPersistentTask] = useCreateLevelTaskMutation({
    update: cacheUpdates.createLevelTask(levelId),
    variables: { input: { levelId } },
  });
  return (
    <>
      <div className={styles.taskListContainer}>
        <LevelTasksList levelId={levelId} />
      </div>
      <DottedAddButton
        onClick={() => createPersistentTask()}
        text={MSG.buttonAddPersistentTask}
      />
    </>
  );
};

LevelTasksEdit.displayName = displayName;

export default LevelTasksEdit;
