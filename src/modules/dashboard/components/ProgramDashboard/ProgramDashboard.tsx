import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Button from '~core/Button';
import Heading from '~core/Heading';
import { Tab, TabList, TabPanel, Tabs } from '~core/Tabs';
import ProgramLevelsList from '~dashboard/ProgramLevelsList';
import ProgramReview from '~dashboard/ProgramReview';
import { OneProgram, useEnrollInProgramMutation } from '~data/index';

import styles from './ProgramDashboard.css';

const MSG = defineMessages({
  buttonJoinProgram: {
    id: 'dashboard.ProgramDashboard.buttonJoinProgram',
    defaultMessage: 'Join Program',
  },
  linkEdit: {
    id: 'dashboard.ProgramDashboard.linkEdit',
    defaultMessage: 'Edit',
  },
  unnamedProgramTitle: {
    id: 'dashboard.ProgramDashboard.unnamedProgramTitle',
    defaultMessage: 'Unnamed Program',
  },
  tabLevels: {
    id: 'dashboard.ProgramDashboard.tabLevels',
    defaultMessage: 'Levels',
  },
  tabReview: {
    id: 'dashboard.ProgramDashboard.tabReview',
    defaultMessage: 'Review',
  },
});

interface Props {
  canAdmin: boolean;
  colonyName: string;
  program: OneProgram;
  toggleEditMode: () => void;
}

const displayName = 'dashboard.ProgramDashboard';

const ProgramDashboard = ({
  canAdmin,
  colonyName,
  program: { id: programId, description, enrolled, levelIds, title },
  program,
  toggleEditMode,
}: Props) => {
  const history = useHistory();
  const [enrollInProgramMutation, { loading }] = useEnrollInProgramMutation({
    variables: { input: { id: programId } },
  });

  const enrollInProgram = useCallback(async () => {
    await enrollInProgramMutation();
    // I don't know what people do all day
    if (levelIds[0]) {
      history.push(
        `/colony/${colonyName}/program/${programId}/level/${levelIds[0]}`,
        { showWelcomeMessage: true },
      );
    }
  }, [colonyName, enrollInProgramMutation, history, levelIds, programId]);

  return (
    <div>
      <div className={styles.titleContainer}>
        <div className={styles.headingContainer}>
          <Heading
            appearance={{ margin: 'none', size: 'medium' }}
            text={title || MSG.unnamedProgramTitle}
          />
          {canAdmin && (
            <div className={styles.editButtonContainer}>
              <Button
                appearance={{ theme: 'blue' }}
                onClick={toggleEditMode}
                text={MSG.linkEdit}
              />
            </div>
          )}
        </div>
        {!enrolled && (
          <div>
            <Button
              loading={loading}
              onClick={enrollInProgram}
              text={MSG.buttonJoinProgram}
            />
          </div>
        )}
      </div>
      {description && <p className={styles.description}>{description}</p>}
      {canAdmin ? (
        <Tabs>
          <TabList>
            <Tab>
              <FormattedMessage {...MSG.tabLevels} />
            </Tab>
            <Tab>
              <FormattedMessage {...MSG.tabReview} />
            </Tab>
          </TabList>
          <TabPanel>
            <ProgramLevelsList colonyName={colonyName} program={program} />
          </TabPanel>
          <TabPanel>
            <ProgramReview program={program} />
          </TabPanel>
        </Tabs>
      ) : (
        <div className={styles.levelsContainer}>
          <ProgramLevelsList colonyName={colonyName} program={program} />
        </div>
      )}
    </div>
  );
};

ProgramDashboard.displayName = displayName;

export default ProgramDashboard;
