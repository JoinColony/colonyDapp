/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './ProgressBar.css';

type Props = {
  stepCount?: number,
  step?: number,
};

const MSG = defineMessages({
  step: {
    id: 'ProgressBar.text.step',
    defaultMessage: 'STEP {step} / {stepCount}',
  },
});

class ProgressBar extends Component<Props> {
  calculateStepProportion = () => {
    const { step, stepCount } = this.props;
    return step && stepCount ? step / stepCount : 0;
  };

  render() {
    const { step, stepCount } = this.props;
    const style = { width: `${this.calculateStepProportion() * 100}%` };
    return (
      <div className={styles.progressBarContainer}>
        {!!stepCount && (
          <div className={styles.stepCounter}>
            <FormattedMessage {...MSG.step} values={{ step, stepCount }} />
          </div>
        )}
        <div className={styles.progressBar} style={style} />
      </div>
    );
  }
}

ProgressBar.displayName = 'core.ProgressBar';

export default ProgressBar;
