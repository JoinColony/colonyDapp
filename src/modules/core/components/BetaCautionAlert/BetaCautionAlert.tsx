import React, { useState } from 'react';
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
  learnMore: {
    id: 'BetaCautionAlert.learnMore',
    defaultMessage: 'Learn more',
  },
};

const BetaCautionAlert = () => {
  const [isHovered, setIsHovered] = useState(false);

  const toggleHover = (hasHover) => setIsHovered(hasHover);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => toggleHover(true)}
      onMouseLeave={() => toggleHover(false)}
    >
      {isHovered ? (
        <a
          // need to provide a proper link (probably to notion page)
          href="https://colony.io"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <FormattedMessage {...MSG.learnMore} />
        </a>
      ) : (
        <>
          <div className={styles.pinkStripe} />
          <div>
            <div className={styles.betaText}>
              <FormattedMessage {...MSG.beta} />
            </div>
            <div className={styles.cautionText}>
              <FormattedMessage {...MSG.cautionText} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BetaCautionAlert;
