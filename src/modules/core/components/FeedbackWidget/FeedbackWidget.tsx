import React from 'react';
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
    defaultMessage: 'We ♥️ feedback!',
  },
};

const FeedbackWidget = () => {
  const { username } = useLoggedInUser();

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className={styles.container}>
      <FeedbackFish
        projectId={
          process.env.FEEDBACK_FISH_PROJECT_ID === undefined || isDevelopment
            ? PROJECT_ID
            : process.env.FEEDBACK_FISH_PROJECT_ID
        }
        userId={username === null ? undefined : username}
      >
        <Button
          appearance={{ theme: 'no-style' }}
          className={styles.button}
          text={MSG.loveFeedback}
        />
      </FeedbackFish>
    </div>
  );
};

export default FeedbackWidget;
