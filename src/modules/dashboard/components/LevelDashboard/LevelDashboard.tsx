import React, { useCallback, useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';

import { getLevelTotalPayouts } from '../../../transformers';
import BreadCrumb from '~core/BreadCrumb';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { SpinnerLoader } from '~core/Preloaders';
import {
  ProgramStatus,
  useEnrollInProgramMutation,
  useLevelTasksQuery,
  useLevelQuery,
  useLoggedInUser,
  useProgramQuery,
} from '~data/index';
import { useTransformer } from '~utils/hooks';

import LevelTasksList from '../LevelTasksList';
import LevelAttributes from './LevelAttributes';
import LevelWelcomeDialog from './LevelWelcomeDialog';
import { useUserRolesInDomain } from '../../hooks/useUserRolesInDomain';
import { canAdminister } from '../../../users/checks';

import styles from './LevelDashboard.css';

const MSG = defineMessages({
  buttonJoinProgram: {
    id: 'dashboard.LevelDashboard.buttonJoinProgram',
    defaultMessage: 'Join Program',
  },
});

const displayName = 'dashboard.LevelDashboard';

const LevelDashboard = () => {
  const { colonyName, levelId, programId } = useParams();
  const { walletAddress } = useLoggedInUser();
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

  const levelSteps = levelStepsData ? levelStepsData.level.steps : [];
  const levelTotalPayouts = useTransformer(getLevelTotalPayouts, [levelSteps]);

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

  const userRolesInRoot = useUserRolesInDomain(
    walletAddress,
    programData && programData.program.colonyAddress,
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
    program: { colonyAddress, enrolled, levelIds, status, title: programTitle },
  } = programData;
  const editPath = `/colony/${colonyName}/program/${programId}/level/${levelId}/edit`;
  return (
    <>
      <div className={styles.headingContainer}>
        <div>
          {programTitle && (
            <BreadCrumb
              elements={[programTitle, levelTitle || { id: 'level.untitled' }]}
            />
          )}
        </div>
        <div>
          {canAdminister(userRolesInRoot) && (
            <Button
              appearance={{ theme: 'blue' }}
              linkTo={editPath}
              text={{ id: 'button.edit' }}
            />
          )}
          {!enrolled && status === ProgramStatus.Active && (
            <Button
              loading={enrolling}
              onClick={enrollInProgram}
              text={MSG.buttonJoinProgram}
            />
          )}
        </div>
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
