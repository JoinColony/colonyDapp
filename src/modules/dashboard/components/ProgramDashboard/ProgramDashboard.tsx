import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import { OneProgram, useEnrollInProgramMutation } from '~data/index';

import styles from './ProgramDashboard.css';
import ProgramLevelsList from '~dashboard/ProgramLevelsList';

const MSG = defineMessages({
  buttonJoinProgram: {
    id: 'Dashboard.ProgramDashboard.buttonJoinProgram',
    defaultMessage: 'Join Program',
  },
  linkEdit: {
    id: 'Dashboard.ProgramDashboard.linkEdit',
    defaultMessage: 'Edit',
  },
});

interface Props {
  canAdmin: boolean;
  program: OneProgram;
  toggleEditMode: () => void;
}

const displayName = 'Dashboard.ProgramDashboard';

const ProgramDashboard = ({
  canAdmin,
  program: { id: programId, description, enrolled, title },
  program,
  toggleEditMode,
}: Props) => {
  const [enrollInProgram, { loading }] = useEnrollInProgramMutation({
    variables: { input: { id: programId } },
  });

  return (
    <div>
      <div className={styles.titleContainer}>
        <div className={styles.headingContainer}>
          <Heading
            appearance={{ margin: 'none', size: 'medium' }}
            // fallback to please typescript - can't publish unless there's a title, so this isn't an issue
            text={title || ''}
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
              onClick={() => enrollInProgram()}
              text={MSG.buttonJoinProgram}
            />
          </div>
        )}
      </div>
      {description && <p>{description}</p>}
      <ProgramLevelsList program={program} />
    </div>
  );
};

ProgramDashboard.displayName = displayName;

export default ProgramDashboard;
