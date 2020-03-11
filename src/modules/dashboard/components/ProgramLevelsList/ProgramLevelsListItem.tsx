import React, { useMemo } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import Badge from '~core/Badge';
import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import ProgressBar from '~core/ProgressBar';
import { OneLevelWithUnlocked, useLevelTasksQuery } from '~data/index';
import { getMainClasses } from '~utils/css';

import { useStepsCompleted } from '../../hooks/useStepsCompleted';

import styles from './ProgramLevelsListItem.css';

const MSG = defineMessages({
  linkView: {
    id: 'dashboard.ProgramLevelsList.ProgramLevelsListItem.linkView',
    defaultMessage: 'View',
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
  colonyName: string;
  index: number;
  isUserEnrolled: boolean;
  level: OneLevelWithUnlocked;
}

const displayName = 'dashboard.ProgramLevelsList.ProgramLevelsListItem';

const ProgramLevelsListItem = ({
  colonyName,
  index,
  isUserEnrolled,
  level: {
    id: levelId,
    achievement,
    numRequiredSteps,
    programId,
    stepIds,
    title,
    unlocked,
  },
}: Props) => {
  const levelUrl = `/colony/${colonyName}/program/${programId}/level/${levelId}`;
  const { data: levelTasksData } = useLevelTasksQuery({
    variables: { id: levelId },
  });
  const stepsCompleted = useStepsCompleted(
    (levelTasksData && levelTasksData.level.steps) || [],
  );
  const isComplete =
    (numRequiredSteps && stepsCompleted >= numRequiredSteps) ||
    stepsCompleted === stepIds.length;
  const statusText = useMemo<MessageDescriptor | undefined>(() => {
    if (!unlocked) {
      if (!isUserEnrolled && index === 0) {
        return MSG.statusJoinProgramText;
      }
      return MSG.statusLockedText;
    }
    if (isComplete) {
      return MSG.statusCompleteText;
    }
    return undefined;
  }, [index, isComplete, isUserEnrolled, unlocked]);
  return (
    <div
      className={getMainClasses({}, styles, {
        isLocked: !unlocked,
      })}
    >
      {achievement && title && (
        <div className={styles.badgeContainer}>
          <Badge name={achievement} title={title} />
        </div>
      )}
      <div className={styles.content}>
        <Heading
          appearance={{ margin: 'none', size: 'medium' }}
          text={title || { id: 'level.untitled' }}
        />
        {!statusText && (
          <div className={styles.progressBarContainer}>
            <ProgressBar value={stepsCompleted} max={stepIds.length} />
          </div>
        )}
        {statusText && (
          <div className={styles.statusTextContainer}>
            <FormattedMessage {...statusText} />
            {isComplete && (
              <Icon
                className={styles.iconComplete}
                name="circle-check-primary"
                title={MSG.statusCompleteText}
                viewBox="0 0 21 22"
              />
            )}
          </div>
        )}
      </div>
      <div className={styles.linkContainer}>
        <Button linkTo={levelUrl} text={MSG.linkView} />
      </div>
    </div>
  );
};

ProgramLevelsListItem.displayName = displayName;

export default ProgramLevelsListItem;
