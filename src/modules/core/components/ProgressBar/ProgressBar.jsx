/* @flow */

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './ProgressBar.css';

type Props = {
  stepCount?: number,
  step?: number,
};

class ProgressBar extends Component<Props> {
  calculateStepProportion = () =>
    this.props.step && this.props.stepCount
      ? this.props.step / this.props.stepCount
      : 0;

  render() {
    const style = { width: `${this.calculateStepProportion() * 100}%` };
    return (
      <div className={styles.progressBarContainer}>
        {!!this.props.stepCount && (
          <div className={styles.stepCounter}>
            <FormattedMessage
              id="stepCounter"
              defaultMessage={`STEP {step} / {stepCount}`}
              values={{
                step: this.props.step,
                stepCount: this.props.stepCount,
              }}
            />
          </div>
        )}
        <div className={styles.progressBar} style={style} />
      </div>
    );
  }
}

ProgressBar.displayName = 'core.ProgressBar';

export default ProgressBar;
