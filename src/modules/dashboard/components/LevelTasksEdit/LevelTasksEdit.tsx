import React, { useCallback } from 'react';
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
  const [createPersistentTask, { data }] = useCreateLevelTaskMutation({
    update: cacheUpdates.createLevelTask(levelId),
    variables: { input: { levelId } },
  });

  const handleClick = useCallback(() => {
    createPersistentTask();
  }, [createPersistentTask]);

  const createdTaskId =
    (data && data.createLevelTask && data.createLevelTask.id) || undefined;

  return (
    <>
      <div className={styles.section}>
        <LevelTasksList createdTaskId={createdTaskId} levelId={levelId} />
      </div>
      <div className={styles.section}>
        <DottedAddButton
          onClick={handleClick}
          text={MSG.buttonAddPersistentTask}
        />
      </div>
    </>
  );
};

LevelTasksEdit.displayName = displayName;

export default LevelTasksEdit;
