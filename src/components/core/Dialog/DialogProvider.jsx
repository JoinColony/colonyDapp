/* @flow */

import type { Node } from 'react';
import type { ContextRouter } from 'react-router-dom';

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import nanoid from 'nanoid';

import type { DialogComponent, DialogType } from './types';

const { Provider, Consumer: ContextConsumer } = React.createContext({});

type Props = ContextRouter & {
  children: Node,
  dialogComponents: { [string]: DialogComponent },
};

type State = {
  openDialogs: Array<DialogType>,
};

class DialogProvider extends Component<Props, State> {
  static displayName = 'DialogProvider';

  static defaultProps = {
    dialogComponents: {},
  };

  state = {
    openDialogs: [],
  };

  componentDidUpdate({ location: prevLocation }: Props) {
    const { location } = this.props;
    const { openDialogs } = this.state;
    if (openDialogs.length > 0 && location !== prevLocation) {
      /*
       * Since this provider is at the App level, we only want
       * to reset state if there are openDialogs, otherwise we'll
       * be calling `setState` on each route change, which is
       * quite unnecessary.
       */
      this.resetOpenDialogs();
    }
  }

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

  pushDialog = (
    dialogKey: string,
    props?: { [string]: any },
  ): DialogType | void => {
    const { dialogComponents } = this.props;
    const Dialog = dialogComponents[dialogKey];
    if (!Dialog) {
      // eslint-disable-next-line no-console
      return console.warn(
        // eslint-disable-next-line max-len
        `Unknown Dialog: '${dialogKey}'. See dialogComponents in DialogProvider`,
      );
    }
    let resolvePromise;
    let rejectPromise;
    const key = nanoid();
    const close = (val: any) => {
      this.closeDialog(key);
      if (resolvePromise) resolvePromise(val);
    };
    const cancel = () => {
      this.closeDialog(key);
      if (rejectPromise) rejectPromise(new Error('User cancelled'));
    };
    const dialog = {
      Dialog,
      cancel,
      close,
      key,
      props,
      afterClosed: () =>
        new Promise((resolve, reject) => {
          resolvePromise = resolve;
          rejectPromise = reject;
        }),
    };
    this.setState(({ openDialogs }) => ({
      openDialogs: [...openDialogs, dialog],
    }));
    return dialog;
  };

  resetOpenDialogs = () => {
    this.setState({
      openDialogs: [],
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

export default withRouter(DialogProvider);

export const Consumer = ContextConsumer;
