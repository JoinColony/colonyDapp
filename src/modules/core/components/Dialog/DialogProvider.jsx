/* @flow */

import type { Node } from 'react';

import React, { Component, Fragment } from 'react';
import nanoid from 'nanoid';

import type { Cancel, Close, DialogComponent } from './types';

const { Provider, Consumer: ContextConsumer } = React.createContext({});

type DialogType = {
  Dialog: DialogComponent,
  cancel: Cancel,
  close: Close,
  key: string,
  props: { [string]: any },
};

type Props = {
  children: Node,
  dialogComponents: { [string]: DialogComponent },
};

type State = {
  openDialogs: Array<DialogType>,
};

class DialogProvider extends Component<Props, State> {
  static defaultProps = {
    dialogComponents: {},
  };

  state = {
    openDialogs: [],
  };

  pushDialog = (dialogKey: string, props: { [string]: any }) => {
    const { dialogComponents } = this.props;
    const Dialog = dialogComponents[dialogKey];
    if (!Dialog) {
      return console.warn(
        // eslint-disable-next-line max-len
        `Unknown Dialog: '${dialogKey}'. See dialogComponents in DialogProvider`,
      );
    }
    let resolvePromise;
    let rejectPromise;
    const key = nanoid();
    const promise = new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    const close = (val: any) => {
      this.closeDialog(key);
      resolvePromise(val);
    };
    const cancel = () => {
      this.closeDialog(key);
      rejectPromise(new Error('User cancelled'));
    };
    const dialog = {
      Dialog,
      cancel,
      close,
      key,
      props,
    };
    this.setState(({ openDialogs }) => ({
      openDialogs: [...openDialogs, dialog],
    }));
    return promise;
  };

  closeDialog = (key: string) => {
    const { openDialogs } = this.state;
    const idx = openDialogs.findIndex(dialog => dialog.key === key);
    if (idx < 0) {
      return;
    }
    this.setState({
      openDialogs: [
        ...openDialogs.slice(0, idx),
        ...openDialogs.slice(idx + 1, openDialogs.length),
      ],
    });
  };

  render() {
    const { children } = this.props;
    const { openDialogs } = this.state;
    return (
      <Fragment>
        <Provider value={{ openDialog: this.pushDialog }}>{children}</Provider>
        {openDialogs.map(({ Dialog, props, ...dialogProps }) => (
          <Dialog {...dialogProps} {...props} />
        ))}
      </Fragment>
    );
  }
}

export default DialogProvider;

export const Consumer = ContextConsumer;
