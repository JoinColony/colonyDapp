/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import styles from './ProgressBar.css';

const MSG = defineMessages({
  stepCount: {
    id: 'ProgressBar.stepCount',
    defaultMessage: 'STEP',
  },
});

type ProgressBarProps = {
  stepCount: number,
  step: number,
};

class ProgressBar extends Component<ProgressBarProps> {
  constructor(props) {
    super(props);
    this.state = {
      stepCount: this.props.stepCount,
    };
  }

  calculateStepProportion = () => this.props.step / this.state.stepCount;

  render() {
    const style = { width: `${this.calculateStepProportion() * 100}%` };
    return (
      <div className={`${styles.progressBarContainer}`}>
        {this.props.stepCount ? (
          <div className={`${styles.stepCounter}`}>
            {`${MSG.stepCount.defaultMessage} ${this.props.step} / ${
              this.state.stepCount
            }`}
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
