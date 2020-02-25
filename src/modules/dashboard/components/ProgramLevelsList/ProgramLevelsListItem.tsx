import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import { OneLevelWithUnlocked } from '~data/index';

import styles from './ProgramLevelsListItem.css';

const MSG = defineMessages({
  linkView: {
    id: 'dashboard.ProgramLevelsList.ProgramLevelsListItem.linkView',
    defaultMessage: 'View',
  },
  untitledLevel: {
    id: 'dashboard.ProgramLevelsList.ProgramLevelsListItem.untitledLevel',
    defaultMessage: 'Untitled Level',
  },
  statusCompleteText: {
    id: 'dashboard.ProgramLevelsList.LevelStatusContent.completeText',
    defaultMessage: 'Complete!',
  },
  statusJoinProgramText: {
    id: 'dashboard.ProgramLevelsList.LevelStatusContent.joinProgramText',
    defaultMessage: 'Locked. Join the program to get started.',
  },
  statusLockedText: {
    id: 'dashboard.ProgramLevelsList.LevelStatusContent.lockedText',
    defaultMessage: 'Locked',
  },
});

interface Props {
  index: number;
  isUserEnrolled: boolean;
  level: OneLevelWithUnlocked;
}

const displayName = 'dashboard.ProgramLevelsList.ProgramLevelsListItem';

const ProgramLevelsListItem = ({
  index,
  isUserEnrolled,
  level: { title, unlocked },
}: Props) => {
  const statusText = useMemo(() => {
    if (!unlocked) {
      if (!isUserEnrolled && index === 0) {
        return MSG.statusJoinProgramText;
      }
      return MSG.statusLockedText;
    }
    return MSG.statusCompleteText;
  }, [index, isUserEnrolled, unlocked]);
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <Heading
          appearance={{ margin: 'none', size: 'medium' }}
          text={title || MSG.untitledLevel}
        />
        {/* @todo return progress bar if enrolled and step not locked */}
        <FormattedMessage {...statusText} />
      </div>
      <div className={styles.linkContainer}>
        <Button text={MSG.linkView} />
      </div>
    </div>
  );
};

ProgramLevelsListItem.displayName = displayName;

export default ProgramLevelsListItem;
