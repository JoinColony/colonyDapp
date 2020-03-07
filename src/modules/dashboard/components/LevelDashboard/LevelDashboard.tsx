import React, { useCallback, useEffect, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';
import BigNumber from 'bn.js';

import BreadCrumb from '~core/BreadCrumb';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { SpinnerLoader } from '~core/Preloaders';
import {
  useLevelQuery,
  useProgramQuery,
  useEnrollInProgramMutation,
  useLevelTasksQuery,
} from '~data/index';

import LevelAttributes from './LevelAttributes';
import LevelTasksList from '../LevelTasksList';
import LevelWelcomeDialog from './LevelWelcomeDialog';

import styles from './LevelDashboard.css';

const MSG = defineMessages({
  buttonJoinProgram: {
    id: 'dashboard.LevelDashboard.buttonJoinProgram',
    defaultMessage: 'Join Program',
  },
  untitledLevel: {
    id: 'dashboard.LevelDashboard.untitledLevel',
    defaultMessage: 'Untitled Level',
  },
});

interface PayoutBadge {
  amount: string;
  symbol: string;
}

const displayName = 'dashboard.LevelDashboard';

const LevelDashboard = () => {
  const { levelId, programId } = useParams();
  const { state } = useLocation();
  const showWelcomeMessage = (state && state.showWelcomeMessage) || false;
  const openDialog = useDialog(LevelWelcomeDialog);
  const [
    enrollInProgramMutation,
    { loading: enrolling },
  ] = useEnrollInProgramMutation({
    variables: { input: { id: programId } },
  });
  const { data: levelData, loading: levelLoading } = useLevelQuery({
    variables: { id: levelId },
  });
  const { data: programData, loading: programLoading } = useProgramQuery({
    variables: { id: programId },
  });
  const { data: levelStepsData } = useLevelTasksQuery({
    variables: { id: levelId },
  });

  const levelTotalPayouts = useMemo<PayoutBadge[]>(() => {
    if (!levelStepsData || !levelStepsData.level.steps) {
      return [];
    }
    const newPayouts: Record<
      PayoutBadge['symbol'],
      PayoutBadge['amount']
    > = levelStepsData.level.steps.reduce((prev, { payouts }) => {
      const current = prev;
      payouts.forEach(({ amount, token: { symbol } }) => {
        const newBnAmount = new BigNumber(amount);
        const currentVal = prev[symbol];
        current[symbol] = !currentVal
          ? newBnAmount.toString()
          : new BigNumber(currentVal).add(newBnAmount).toString();
      });
      return current;
    }, {});
    return Object.keys(newPayouts).map(payoutKey => ({
      amount: newPayouts[payoutKey],
      symbol: payoutKey,
    }));
  }, [levelStepsData]);

  const enrollInProgram = useCallback(async () => {
    await enrollInProgramMutation();
    if (levelData && programData) {
      const { title: programTitle } = programData.program;
      openDialog({
        level: levelData.level,
        programTitle: programTitle || '',
        levelTotalPayouts,
      });
    }
  }, [
    enrollInProgramMutation,
    levelData,
    levelTotalPayouts,
    openDialog,
    programData,
  ]);

  useEffect(() => {
    if (showWelcomeMessage && levelData && programData) {
      const { title: programTitle } = programData.program;
      openDialog({
        level: levelData.level,
        programTitle: programTitle || '',
        levelTotalPayouts,
      });
    }
  }, [
    levelData,
    levelTotalPayouts,
    openDialog,
    programData,
    showWelcomeMessage,
  ]);

  if (levelLoading || programLoading || !levelData || !programData) {
    return <SpinnerLoader />;
  }

  const {
    level: { title: levelTitle, unlocked },
    level,
  } = levelData;
  const {
    program: { colonyAddress, enrolled, levelIds, title: programTitle },
  } = programData;
  return (
    <>
      <div className={styles.headingContainer}>
        <div>
          {programTitle && (
            <BreadCrumb
              elements={[programTitle, levelTitle || MSG.untitledLevel]}
            />
          )}
        </div>
        {!enrolled && (
          <div>
            <Button
              loading={enrolling}
              onClick={enrollInProgram}
              text={MSG.buttonJoinProgram}
            />
          </div>
        )}
      </div>
      <LevelAttributes
        enrolled={enrolled}
        level={level}
        levelIds={levelIds}
        levelTotalPayouts={levelTotalPayouts}
      />
      <LevelTasksList
        colonyAddress={colonyAddress}
        levelId={level.id}
        unlocked={unlocked}
      />
    </>
  );
};

LevelDashboard.displayName = displayName;

export default LevelDashboard;
