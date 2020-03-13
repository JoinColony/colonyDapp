import React, { useMemo, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Badge from '~core/Badge';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Panel, { PanelSection } from '~core/Panel';
import ProgressBar from '~core/ProgressBar';
import Tag from '~core/Tag';
import {
  OneLevelWithUnlocked,
  OneProgram,
  OneLevel,
  useLevelLazyQuery,
} from '~data/index';
import { Address } from '~types/index';

import { useStepsCompleted } from '../../hooks/useStepsCompleted';

import styles from './LevelAttributes.css';

const MSG = defineMessages({
  completeNumText: {
    id: 'dashboard.LevelDashboard.LevelAttributes.completeNumText',
    defaultMessage: `Complete {allStepsRequired, select,
      true {{numRequiredSteps, plural,
        one {the only}
        other {all}
      }}
      false {at least {numRequiredSteps}}
    } {numRequiredSteps, plural,
      one {task}
      other {tasks}
    }`,
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
  titleRewards: {
    id: 'dashboard.LevelDashboard.LevelAttributes.titleRewards',
    defaultMessage: 'Rewards',
  },
});

interface Props {
  enrolled: OneProgram['enrolled'];
  level: OneLevelWithUnlocked;
  levelIds: OneProgram['levelIds'];
  levelTotalPayouts: { address: Address; amount: string; symbol: string }[];
}

const displayName = 'dashboard.LevelDashboard.LevelAttributes';

const LevelAttributes = ({
  enrolled,
  levelIds,
  level: {
    id: levelId,
    achievement,
    description,
    stepIds,
    steps,
    title,
    numRequiredSteps,
    unlocked,
  },
  levelTotalPayouts,
}: Props) => {
  const [
    fetchDependentLevel,
    { data: dependentLevelData },
  ] = useLevelLazyQuery();

  const dependentLevelId = useMemo<OneLevel['id'] | undefined>(
    () => levelIds[levelIds.indexOf(levelId) - 1],
    [levelId, levelIds],
  );
  const stepsCompleted = useStepsCompleted(steps);

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
              text={title || { id: 'level.untitled' }}
            />
            <div className={styles.headingRewardsContainer}>
              <div className={styles.rewardItem}>
                <Heading
                  appearance={{ margin: 'none', size: 'normal' }}
                  text={MSG.titleRewards}
                />
              </div>
              {levelTotalPayouts.map(({ address, amount, symbol }) => (
                <div className={styles.rewardItem} key={address}>
                  <Tag
                    appearance={{ theme: 'golden' }}
                    text={`${amount} ${symbol}`}
                    title={address}
                  />
                </div>
              ))}
              {achievement && (
                <div className={styles.rewardItem}>
                  <Badge size="s" title={title || ''} name={achievement} />
                </div>
              )}
            </div>
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
                          dependentLevelName: dependentLevelData.level
                            .title || { id: 'level.untitled' },
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
