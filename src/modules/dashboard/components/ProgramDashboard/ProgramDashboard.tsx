import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import { OneProgram } from '~data/index';

import styles from './ProgramDashboard.css';

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
  program: { description, title },
  toggleEditMode,
}: Props) => (
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
      <div>
        <Button text={MSG.buttonJoinProgram} />
      </div>
    </div>
    {description && <p>{description}</p>}
  </div>
);

ProgramDashboard.displayName = displayName;

export default ProgramDashboard;
