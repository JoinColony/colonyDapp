import React, { useState } from 'react';

import Button from '~core/Button';

import styles from './FeedbackWidget.css';

const MSG = {
  loveFeedback: {
    id: 'FeedbackWidget.loveFeedback',
    defaultMessage: 'We ♥️ feedback!',
  },
};

const FeedbackWidget = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOpen, setIsOpen] = useState(false);

  const openFeedbackFish = () => {
    setIsOpen(true);
  };

  return (
    <div className={styles.container}>
      <Button
        appearance={{ theme: 'no-style' }}
        className={styles.button}
        text={MSG.loveFeedback}
        onClick={openFeedbackFish}
      />
    </div>
  );
};

export default FeedbackWidget;
