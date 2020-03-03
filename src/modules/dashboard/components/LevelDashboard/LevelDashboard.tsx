import React, { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import BreadCrumb from '~core/BreadCrumb';
import { useDialog } from '~core/Dialog';
import { SpinnerLoader } from '~core/Preloaders';
import { useLevelQuery, useProgramQuery } from '~data/index';

import LevelAttributes from './LevelAttributes';
import LevelTasksList from '../LevelTasksList';
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

  if (levelLoading || programLoading || !levelData || !programData) {
    return <SpinnerLoader />;
  }

  const {
    level: { title: levelTitle, unlocked },
    level,
  } = levelData;
  const {
    program: { colonyAddress, title: programTitle },
  } = programData;
  return (
    <>
      {programTitle && (
        // @todo remove default `levelTitle` after level edit merged in
        <BreadCrumb elements={[programTitle, levelTitle || 'Untitled']} />
      )}
      <LevelAttributes level={level} />
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
