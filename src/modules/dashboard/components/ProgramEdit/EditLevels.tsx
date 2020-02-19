import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import ProgramLevelsList from '~dashboard/ProgramLevelsList';
import { OneProgram, useCreateLevelMutation } from '~data/index';

import styles from './EditLevels.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.EditLevels.title',
    defaultMessage: 'Levels',
  },
  description: {
    id: 'dashboard.EditLevels.description',
    defaultMessage: `Levels must be completed in order. Subsequent levels are locked until the previous level is completed.`,
  },
  buttonAddLevel: {
    id: 'dashboard.EditLevels.buttonAddLevel',
    defaultMessage: 'Add level',
  },
});

interface Props {
  colonyName: string;
  levelIds: OneProgram['levelIds'];
  levels: OneProgram['levels'];
  programId: OneProgram['id'];
}

const displayName = 'dashboard.EditLevels';

const EditLevels = ({ colonyName, levelIds, levels, programId }: Props) => {
  const [createLevel] = useCreateLevelMutation({
    variables: { input: { programId } },
  });
  // @todo redirect to level upon creation once level template exists (after #2019)
  const handleAddLevel = useCallback(() => {
    createLevel();
  }, [createLevel]);
  return (
    <div>
      <Heading appearance={{ size: 'medium' }} text={MSG.title} />
      <Heading
        appearance={{ size: 'normal', weight: 'thin' }}
        text={MSG.description}
      />
      <div className={styles.programLevelsContainer}>
        <ProgramLevelsList
          colonyName={colonyName}
          levelIds={levelIds}
          levels={levels}
          programId={programId}
        />
      </div>
      <Button appearance={{ theme: 'dottedArea' }} onClick={handleAddLevel}>
        <span className={styles.buttonTextContainer}>
          <div className={styles.buttonIcon}>
            <Icon
              appearance={{ size: 'medium' }}
              name="circle-plus"
              title={MSG.buttonAddLevel}
            />
          </div>
          <FormattedMessage {...MSG.buttonAddLevel} />
        </span>
      </Button>
    </div>
  );
};

EditLevels.displayName = displayName;

export default EditLevels;
