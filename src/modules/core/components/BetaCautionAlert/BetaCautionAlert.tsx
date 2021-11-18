import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import ExternalLink from '~core/ExternalLink';

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

const LEARN_MORE_LINK = `https://www.notion.so/colony/Beta-Disclaimer-83a9870fe20e430fa15f1e097a0bc6d8`;

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
        <ExternalLink
          text={{ id: 'text.learnMore' }}
          className={styles.link}
          href={LEARN_MORE_LINK}
        />
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
