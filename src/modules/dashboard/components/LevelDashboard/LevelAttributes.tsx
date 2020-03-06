import React, { useMemo, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Panel, { PanelSection } from '~core/Panel';
import ProgressBar from '~core/ProgressBar';
import {
  OneLevelWithUnlocked,
  OneProgram,
  useLevelTasksQuery,
  OneLevel,
  useLevelLazyQuery,
} from '~data/index';

import { numStepsCompleted } from '../shared/levelSteps';

import styles from './LevelAttributes.css';

const MSG = defineMessages({
  completeNumText: {
    id: 'dashboard.LevelDashboard.LevelAttributes.completeNumText',
    defaultMessage: `Complete {allStepsRequired, select,
      true {all}
      false {at least {numRequiredSteps}}
    } tasks`,
  },
  completeToUnlockText: {
    id: 'dashboard.LevelDashboard.LevelAttributes.completeToUnlockText',
    defaultMessage: 'Complete {dependentLevelName} level to unlock',
  },
  completionText: {
    id: 'dashboard.LevelDashboard.LevelAttributes.completionText',
    defaultMessage: 'Completion Requirements',
  },
  joinToUnlock: {
    id: 'dashboard.LevelDashboard.LevelAttributes.joinToUnlock',
    defaultMessage: 'Join this program to unlock',
  },
  titleLocked: {
    id: 'dashboard.LevelDashboard.LevelAttributes.titleLocked',
    defaultMessage: 'Locked',
  },
  untitled: {
    id: 'dashboard.LevelDashboard.LevelAttributes.untitled',
    defaultMessage: 'Untitled',
  },
});

interface Props {
  enrolled: OneProgram['enrolled'];
  level: OneLevelWithUnlocked;
  levelIds: OneProgram['levelIds'];
}

const displayName = 'dashboard.LevelDashboard.LevelAttributes';

const LevelAttributes = ({
  enrolled,
  levelIds,
  level: {
    id: levelId,
    description,
    stepIds,
    title,
    numRequiredSteps,
    unlocked,
  },
}: Props) => {
  const [
    fetchDependentLevel,
    { data: dependentLevelData },
  ] = useLevelLazyQuery();
  const { data: levelTasksData } = useLevelTasksQuery({
    variables: { id: levelId },
  });

  const dependentLevelId = useMemo<OneLevel['id'] | undefined>(
    () => levelIds[levelIds.indexOf(levelId) - 1],
    [levelId, levelIds],
  );

  const stepsCompleted = useMemo(() => {
    const steps = (levelTasksData && levelTasksData.level.steps) || [];
    return numStepsCompleted(steps);
  }, [levelTasksData]);

  useEffect(() => {
    if (dependentLevelId) {
      fetchDependentLevel({ variables: { id: dependentLevelId } });
    }
  }, [dependentLevelId, fetchDependentLevel]);

  const allStepsRequired = numRequiredSteps === stepIds.length;
  return (
    <div className={styles.main}>
      <Panel>
        <PanelSection>
          <div className={styles.headingContainer}>
            <Heading
              appearance={{ margin: 'none', size: 'medium', weight: 'thin' }}
              text={title || MSG.untitled}
            />
          </div>
        </PanelSection>
        {description && (
          <PanelSection>
            <p>{description}</p>
          </PanelSection>
        )}
        <PanelSection>
          <div className={styles.requirementsContainer}>
            <div>
              <Heading
                appearance={{ margin: 'none', size: 'normal' }}
                text={MSG.completionText}
              />
            </div>
            <div className={styles.progressContainer}>
              {unlocked && (
                <div className={styles.progressContainerInner}>
                  <div className={styles.completionCopy}>
                    <p>
                      <FormattedMessage
                        {...MSG.completeNumText}
                        values={{
                          allStepsRequired,
                          numRequiredSteps: numRequiredSteps || stepIds.length,
                        }}
                      />
                    </p>
                  </div>
                  <div className={styles.progressBarContainer}>
                    <ProgressBar
                      value={stepsCompleted}
                      max={numRequiredSteps || stepIds.length}
                    />
                  </div>
                  <div className={styles.progressTextContainer}>
                    {stepsCompleted} / {numRequiredSteps}
                  </div>
                </div>
              )}
              {!unlocked && (
                <div className={styles.enrollmentStatusContainer}>
                  <Icon name="lock" title={MSG.titleLocked} />
                  <p className={styles.enrollmentStatusText}>
                    {enrolled && dependentLevelData ? (
                      <FormattedMessage
                        {...MSG.completeToUnlockText}
                        values={{
                          dependentLevelName:
                            dependentLevelData.level.title || MSG.untitled,
                        }}
                      />
                    ) : (
                      <FormattedMessage {...MSG.joinToUnlock} />
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </PanelSection>
      </Panel>
    </div>
  );
};

LevelAttributes.displayName = displayName;

export default LevelAttributes;
