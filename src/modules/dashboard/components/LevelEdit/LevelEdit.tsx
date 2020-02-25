import React from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import Card from '~core/Card';
import Heading from '~core/Heading';
import CenteredTemplate from '~pages/CenteredTemplate';

import styles from './LevelEdit.css';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.LevelEdit.heading',
    defaultMessage: 'Edit Level',
  },
});

const LevelEdit = () => {
  const { programId } = useParams();
  return (
    <CenteredTemplate>
      <div className={styles.main}>
        <Heading
          appearance={{ margin: 'small', size: 'medium' }}
          text={MSG.heading}
        />
        <Card>{programId}</Card>
      </div>
    </CenteredTemplate>
  );
};

export default LevelEdit;
