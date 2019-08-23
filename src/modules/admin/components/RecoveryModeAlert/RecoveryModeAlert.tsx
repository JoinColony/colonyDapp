import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './RecoveryModeAlert.css';

const MSG = defineMessages({
  message: {
    id: 'admin.RecoveryModeAlert.message',
    defaultMessage: 'This colony is in Recovery mode!',
  },
});

const displayName = 'admin.RecoveryModeAlert';

const RecoveryModeAlert = () => (
  <div className={styles.main}>
    <FormattedMessage {...MSG.message} />
  </div>
);

RecoveryModeAlert.displayName = displayName;

export default RecoveryModeAlert;
