import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './StepBar.css';

import ProgressBar from './ProgressBar';

const MSG = defineMessages({
  step: {
    id: 'ProgressBar.text.step',
    defaultMessage: 'STEP {step} / {stepCount}',
  },
});

interface Props {
  step: number;
  stepCount: number;
}

// Disclaimer: this might not necessarily be a core component,
// so if we see that we're using it just once or it's too specific, we can act accordingly
const StepBar = ({ step, stepCount }: Props) => (
  <div className={styles.main}>
    <div className={styles.stepCounter}>
      <FormattedMessage {...MSG.step} values={{ step, stepCount }} />
    </div>
    <div className={styles.progressContainer}>
      <ProgressBar value={step} max={stepCount} />
    </div>
  </div>
);

export default StepBar;
