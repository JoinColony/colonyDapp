import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  noClaims: {
    id: 'users.TokenActivation.TokenActivationContent.ClaimsTab.noClaims',
    defaultMessage: 'There are currently no claims',
  },
});

const ClaimsTab = () => {
  return (
    <div className={styles.claimsContainer}>
      <FormattedMessage {...MSG.noClaims} />
    </div>
  );
};

export default ClaimsTab;
