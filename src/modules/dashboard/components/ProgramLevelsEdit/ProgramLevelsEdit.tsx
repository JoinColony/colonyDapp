import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router';

import { DottedAddButton } from '~core/Button';
import Heading from '~core/Heading';
import { OneProgram, useCreateLevelMutation, cacheUpdates } from '~data/index';

import LevelsList from './LevelsList';

import styles from './ProgramLevelsEdit.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ProgramLevelsEdit.title',
    defaultMessage: 'Levels',
  },
  description: {
    id: 'dashboard.ProgramLevelsEdit.description',
    defaultMessage: `Levels must be completed in order. Subsequent levels are locked until the previous level is completed.`,
  },
  buttonAddLevel: {
    id: 'dashboard.ProgramLevelsEdit.buttonAddLevel',
    defaultMessage: 'Add level',
  },
});

interface Props {
  colonyName: string;
  program: OneProgram;
}

const displayName = 'dashboard.ProgramLevelsEdit';

const ProgramLevelsEdit = ({
  colonyName,
  program: { id: programId },
  program,
}: Props) => {
  const history = useHistory();

  const [createLevel] = useCreateLevelMutation({
    variables: { input: { programId } },
    update: cacheUpdates.createLevel(programId),
  });

  const handleAddLevel = useCallback(async () => {
    const { data: mutationResult } = await createLevel();
    const levelId =
      mutationResult &&
      mutationResult.createLevel &&
      mutationResult.createLevel.id;
    if (levelId) {
      history.push(
        `/colony/${colonyName}/program/${programId}/level/${levelId}/edit`,
      );
    }
  }, [colonyName, createLevel, history, programId]);

  return (
    <div>
      <Heading appearance={{ size: 'medium' }} text={MSG.title} />
      <Heading
        appearance={{ size: 'normal', weight: 'thin' }}
        text={MSG.description}
      />
      <div className={styles.programLevelsContainer}>
        <LevelsList colonyName={colonyName} program={program} />
      </div>
      <DottedAddButton onClick={handleAddLevel} text={MSG.buttonAddLevel} />
    </div>
  );
};

ProgramLevelsEdit.displayName = displayName;

export default ProgramLevelsEdit;
