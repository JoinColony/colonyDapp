import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '~core/Button';

import styles from './FeedbackWidget.css';

const MSG = {
  loveFeedback: {
    id: 'FeedbackWidget.loveFeedback',
    defaultMessage: 'We {heart} feedback!',
  },
};

const FeedbackWidget = () => (
  <div className={styles.main}>
    <Button
      appearance={{ theme: 'no-style' }}
      className={styles.link}
      // eslint-disable-next-line no-undef
      onClick={() => Beamer.show()}
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
