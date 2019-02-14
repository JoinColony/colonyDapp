/* @flow */

import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import styles from './StepBar.css';

import ProgressBar from './ProgressBar.jsx';

const MSG = defineMessages({
  step: {
    id: 'ProgressBar.text.step',
    defaultMessage: 'STEP {step} / {stepCount}',
  },
});

type Props = {|
  step: number,
  stepCount: number,
|};

// Disclaimer: this might not necessarily be a core component,
// so if we see that we're using it just once or it's too specific, we can act accordingly
const StepBar = ({ step, stepCount }: Props) => (
  <div className={styles.main}>
    <ProgressBar value={step} max={stepCount} />
    <div className={styles.stepCounter}>
      <FormattedMessage {...MSG.step} values={{ step, stepCount }} />
    </div>
  </div>
);

export default injectIntl(StepBar);
