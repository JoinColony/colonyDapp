import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { DottedAddButton } from '~core/Button';
import {
  LevelDocument,
  LevelQueryVariables,
  OneLevel,
  useCreateLevelTaskMutation,
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
  levelSteps: OneLevel['steps'];
}

const displayName = 'dashboard.LevelTasksEdit';

const LevelTasksEdit = ({ levelId, levelSteps }: Props) => {
  const [createPersistentTask, { data }] = useCreateLevelTaskMutation({
    refetchQueries: [
      // Prefer refetch of query over cache update
      {
        query: LevelDocument,
        variables: { id: levelId } as LevelQueryVariables,
      },
    ],
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
        <LevelTasksList
          createdTaskId={createdTaskId}
          levelId={levelId}
          levelSteps={levelSteps}
        />
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
