import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FeedbackFish } from '@feedback-fish/react';

import Button from '~core/Button';
import { useLoggedInUser } from '~data/index';

import styles from './FeedbackWidget.css';

/* can add real project id from personal account if need to test.
I've tested the feedback.fish process - works very well */
const PROJECT_ID = '';

const MSG = {
  loveFeedback: {
    id: 'FeedbackWidget.loveFeedback',
    defaultMessage: 'We {heart} feedback!',
  },
};

const FeedbackWidget = () => {
  const { username } = useLoggedInUser();

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <FeedbackFish
      projectId={
        /* the second check is for the types
        if the projectId is an empty string the feedback won't be sent */
        isDevelopment || process.env.FEEDBACK_FISH_PROJECT_ID === undefined
          ? PROJECT_ID
          : process.env.FEEDBACK_FISH_PROJECT_ID
      }
      userId={username === null ? undefined : username}
    >
      <Button appearance={{ theme: 'no-style' }} className={styles.button}>
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
    </FeedbackFish>
  );
};

export default FeedbackWidget;
