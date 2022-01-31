import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  noClaims: {
    id: 'users.TokenActivation.TokenActivationContent.ClaimsTab.noClaims',
    defaultMessage: 'There are no stakes to claim.',
  },
});

const ClaimsTab = () => {
  return (
    <div className={styles.claimsContainer}>
      <div className={styles.noClaims}>
        <FormattedMessage {...MSG.noClaims} />
      </div>
    </div>
  );
};

export default ClaimsTab;
