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
  /** Steps completed */
  step: number;
  /** Total steps */
  stepCount: number;
}

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
