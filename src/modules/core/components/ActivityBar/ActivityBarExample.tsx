import React, { Component } from 'react';

import ActivityBar from './ActivityBar';
import styles from './ActivityBar.css';

import Button from '../Button';

interface Props {
  cancel: () => void;
  close: (val: any) => void;
}

interface State {
  isDismissable: boolean;
}

class ActivityBarExample extends Component<Props, State> {
  state = {
    isDismissable: true,
  };

  render() {
    const { isDismissable } = this.state;
    const { close, cancel } = this.props;

    return (
      <ActivityBar
        isDismissable={isDismissable}
        close={close}
        cancel={cancel}
        shouldCloseOnEsc
      >
        {isDismissable ? (
          <div className={styles.component}>
            <div>you can just dismiss me or ... </div>
            <Button onClick={() => this.setState({ isDismissable: false })}>
              make me require your attention
            </Button>
          </div>
        ) : (
          <div className={styles.component}>
            <div>HELLO I need your attention!!! You can now only... </div>
            <Button onClick={cancel}>dismiss</Button>
            <Button onClick={close}>or confirm</Button>
          </div>
        )}
      </ActivityBar>
    );
  }
}

export default ActivityBarExample;
