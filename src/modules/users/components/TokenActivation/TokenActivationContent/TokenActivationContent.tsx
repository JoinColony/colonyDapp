import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import ClaimsTab from './ClaimsTab';
import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  yourTokens: {
    id: 'users.TokenActivation.TokenActivationContent.yourTokens',
    defaultMessage: 'Your tokens',
  },
  claims: {
    id: 'users.TokenActivation.TokenActivationContent.claims',
    defaultMessage: 'Claims',
  },
});

const TokenActivationContent = () => {
  const [isTokens, setIsTokens] = useState(true);

  return (
    <div className={styles.main}>
      <ul className={styles.tabsContainer}>
        <button
          type="button"
          className={isTokens ? styles.selectedTab : styles.tab}
          onClick={() => setIsTokens(true)}
        >
          <FormattedMessage {...MSG.yourTokens} />
        </button>
        <button
          type="button"
          className={isTokens ? styles.tab : styles.selectedTab}
          onClick={() => setIsTokens(false)}
        >
          <FormattedMessage {...MSG.claims} />
        </button>
      </ul>
      {isTokens ? <div>Placeholder</div> : <ClaimsTab />}
    </div>
  );
};

export default TokenActivationContent;
