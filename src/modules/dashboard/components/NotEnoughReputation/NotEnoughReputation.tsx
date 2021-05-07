import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import DialogSection from '~core/Dialog/DialogSection';

import styles from './NotEnoughReputation.css';

const MSG = defineMessage({
  title: {
    id: 'NotEnoughReputation.title',
    defaultMessage: 'You don’t have enough reputation to create this motion.',
  },
  description: {
    id: 'NotEnoughReputation.description',
    defaultMessage: `If you would like to enforce the action you can use
    permissions. To create the action toggle on Force option in top
    right corner.`,
  },
});

const displayName = 'NotEnoughReputation';

const NotEnoughReputation = () => (
  <DialogSection appearance={{ theme: 'sidePadding' }}>
    <div className={styles.container}>
      <p className={styles.title}>
        <FormattedMessage {...MSG.title} />
      </p>
      <p className={styles.text}>
        <FormattedMessage {...MSG.description} />
      </p>
    </div>
  </DialogSection>
);

NotEnoughReputation.displayName = displayName;

export default NotEnoughReputation;
