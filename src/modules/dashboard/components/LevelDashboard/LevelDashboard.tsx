import React, { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useDialog } from '~core/Dialog';
import { SpinnerLoader } from '~core/Preloaders';
import { useLevelQuery, useProgramQuery } from '~data/index';

import LevelWelcomeDialog from './LevelWelcomeDialog';

const displayName = 'dashboard.LevelDashboard';

const LevelDashboard = () => {
  const { levelId, programId } = useParams();
  const { state } = useLocation();
  const showWelcomeMessage = (state && state.showWelcomeMessage) || false;
  const openDialog = useDialog(LevelWelcomeDialog);
  const { data: levelData, loading: levelLoading } = useLevelQuery({
    variables: { id: levelId },
  });
  const { data: programData, loading: programLoading } = useProgramQuery({
    variables: { id: programId },
  });

  // @TODO actually calculate this (useMemo is mandatory here!)
  const levelTotalPayouts = useMemo(
    () => [{ amount: '2000', symbol: 'CLNY' }],
    [],
  );

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

  if (levelLoading || programLoading) return <SpinnerLoader />;

  return <div />;
};

LevelDashboard.displayName = displayName;

export default LevelDashboard;
