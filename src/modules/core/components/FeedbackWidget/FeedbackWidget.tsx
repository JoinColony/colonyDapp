import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '~core/Button';
import { BEAMER_BUGS } from '~externalUrls';
import { getBeamerId } from '~utils/external';

import styles from './FeedbackWidget.css';

const MSG = {
  loveFeedback: {
    id: 'FeedbackWidget.loveFeedback',
    defaultMessage: 'We {heart} feedback!',
  },
};

const handleFeedback = () => {
  if (getBeamerId) {
    // Ignored undefined third party script, this should be implemented better in future
    // @ts-ignore
    // eslint-disable-next-line no-undef
    Beamer.show();
  } else {
    window.open(BEAMER_BUGS, '_blank');
  }
};

const FeedbackWidget = () => (
  <div className={styles.main}>
    <Button
      appearance={{ theme: 'no-style' }}
      className={styles.link}
      // Ignored undefined third party script, this should be implemented better in future
      // @ts-ignore
      // eslint-disable-next-line no-undef
      onClick={handleFeedback}
    >
      <FormattedMessage
        {...MSG.loveFeedback}
        values={{
          heart: (
            <span role="img" className={styles.heart} aria-label="">
              ♥️
            </span>
          ),
        }}
      />
    </Button>
  </div>
);

export default FeedbackWidget;
