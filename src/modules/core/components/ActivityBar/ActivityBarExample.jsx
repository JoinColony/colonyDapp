/* @flow */
import React, { Component } from 'react';

import ActivityBar from './ActivityBar.jsx';
import ActivityBarComponent from './ActivityBarComponent.jsx';

import Button from '../Button';

type Props = {
  cancel: () => void,
  close: (val: any) => void,
};

type State = {
  isDismissable: boolean,
};

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
          <ActivityBarComponent>
            <div>you can just dismiss me or ... </div>
            <Button onClick={() => this.setState({ isDismissable: false })}>
              make me require your attention
            </Button>
          </ActivityBarComponent>
        ) : (
          <ActivityBarComponent>
            <div>HELLO I need your attention!!! You can now only... </div>
            <Button onClick={cancel}>dismiss</Button>
            <Button onClick={close}>or confirm</Button>
          </ActivityBarComponent>
        )}
      </ActivityBar>
    );
  }
}

export default ActivityBarExample;
