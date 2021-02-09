import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './BetaCautionAlert.css';

const MSG = {
  beta: {
    id: 'BetaCautionAlert.beta',
    defaultMessage: 'BETA 🤓',
  },
  cautionText: {
    id: 'BetaCautionAlert.cautionText',
    defaultMessage: 'Use with caution!',
  },
};

const BetaCautionAlert = () => {
  return (
    <div className={styles.container}>
      <div className={styles.pinkStripe} />
      <div>
        <div className={styles.betaText}>
          <FormattedMessage {...MSG.beta} />
        </div>
        <div className={styles.cautionText}>
          <FormattedMessage {...MSG.cautionText} />
        </div>
      </div>
    </div>
  );
};

export default BetaCautionAlert;
