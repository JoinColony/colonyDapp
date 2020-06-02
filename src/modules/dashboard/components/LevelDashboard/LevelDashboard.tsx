import React, { useCallback, useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import BreadCrumb from '~core/BreadCrumb';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { SpinnerLoader } from '~core/Preloaders';
import {
  useEnrollInProgramMutation,
  useLevelQuery,
  useLoggedInUser,
  useProgramQuery,
  Colony,
  ProgramStatus,
  UserNotificationsDocument,
  UserNotificationsQueryVariables,
} from '~data/index';
import { useTransformer } from '~utils/hooks';

import {
  getLevelTotalPayouts,
  getUserRolesForDomain,
} from '../../../transformers';
import { canAdminister } from '../../../users/checks';
import { useLevelAfter } from '../../hooks/useLevelAfter';
import LevelTasksList from '../LevelTasksList';
import LevelAttributes from './LevelAttributes';
import LevelWelcomeDialog from './LevelWelcomeDialog';

import styles from './LevelDashboard.css';

const MSG = defineMessages({
  buttonJoinProgram: {
    id: 'dashboard.LevelDashboard.buttonJoinProgram',
    defaultMessage: 'Join Program',
  },
});

interface Props {
  colony: Colony;
}

const displayName = 'dashboard.LevelDashboard';

const LevelDashboard = ({ colony }: Props) => {
  const { colonyName, levelId, programId } = useParams<{
    colonyName: string;
    levelId: string;
    programId: string;
  }>();
  const { walletAddress } = useLoggedInUser();
  const location = useLocation<{ showWelcomeMessage?: boolean }>();
  const history = useHistory();
  const { state } = location;
  const showWelcomeMessage = (state && state.showWelcomeMessage) || false;
  const openDialog = useDialog(LevelWelcomeDialog);
  const [
    enrollInProgramMutation,
    { loading: enrolling },
  ] = useEnrollInProgramMutation({
    refetchQueries: [
      {
        query: UserNotificationsDocument,
        variables: {
          address: walletAddress,
        } as UserNotificationsQueryVariables,
      },
    ],
    variables: { input: { id: programId } },
  });
  const { data: levelData, loading: levelLoading } = useLevelQuery({
    variables: { id: levelId },
  });
  const { data: programData, loading: programLoading } = useProgramQuery({
    variables: { id: programId },
  });

  const levelSteps = levelData ? levelData.level.steps : [];
  const levelTotalPayouts = useTransformer(getLevelTotalPayouts, [levelSteps]);

  const nextLevel = useLevelAfter(programData && programData.program, levelId);

  const enrollInProgram = useCallback(async () => {
    await enrollInProgramMutation();
    if (levelData && programData) {
      const { title: programTitle } = programData.program;
      openDialog({
        level: levelData.level,
        levelTotalPayouts,
        nextLevel,
        programTitle: programTitle || '',
      });
    }
  }, [
    enrollInProgramMutation,
    levelData,
    levelTotalPayouts,
    nextLevel,
    openDialog,
    programData,
  ]);

  const userRolesInRoot = getUserRolesForDomain(
    colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  );

  useEffect(() => {
    if (showWelcomeMessage && levelData && programData) {
      const { title: programTitle } = programData.program;
      openDialog({
        level: levelData.level,
        levelTotalPayouts,
        nextLevel,
        programTitle: programTitle || '',
      })
        .afterClosed()
        .then(() => {
          // Make sure we don't show the welcome message again
          history.replace({ ...location, state: undefined });
        });
    }
  }, [
    history,
    levelData,
    levelTotalPayouts,
    location,
    nextLevel,
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
        levelSteps={levelSteps}
        programId={programId}
        unlocked={unlocked}
      />
    </>
  );
};

LevelDashboard.displayName = displayName;

export default LevelDashboard;
