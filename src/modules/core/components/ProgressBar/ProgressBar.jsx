/* @flow */

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './ProgressBar.css';

type ProgressBarProps = {
  stepCount?: number,
  step?: number,
};

type ProgressBarState = {
  stepCount?: number,
};

class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
  state = {
    stepCount: this.props.stepCount,
  };

  calculateStepProportion = () =>
    this.props.step && this.state.stepCount
      ? this.props.step / this.state.stepCount
      : 0;

  render() {
    const style = { width: `${this.calculateStepProportion() * 100}%` };
    return (
      <div className={`${styles.progressBarContainer}`}>
        {this.props.stepCount ? (
          <div className={`${styles.stepCounter}`}>
            <FormattedMessage
              id="stepCounter"
              defaultMessage={`STEP {step} / {stepCount}`}
              values={{
                step: this.props.step,
                stepCount: this.state.stepCount,
              }}
            />
          </div>
        ) : (
          undefined
        )}
        <div className={`${styles.progressBar}`} style={style} />
      </div>
    );
  }
}

ProgressBar.displayName = 'core.ProgressBar';

export default ProgressBar;
