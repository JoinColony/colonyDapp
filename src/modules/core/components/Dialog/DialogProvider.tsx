import React, { Component, ReactNode } from 'react';
import { withRouter } from 'react-router-dom';
import nanoid from 'nanoid';

import { DialogComponent, DialogType } from './types';

const { Provider, Consumer: ContextConsumer } = React.createContext({});

interface Props {
  children: ReactNode;
  dialogComponents: { [k: string]: DialogComponent };
  location: any;
}

interface State {
  openDialogs: DialogType[];
}

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
    props?: { [k: string]: any },
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
      <>
        <Provider value={{ openDialog: this.pushDialog }}>{children}</Provider>
        {openDialogs.map(({ Dialog, props, ...dialogProps }) => (
          <Dialog {...dialogProps} {...props} />
        ))}
      </>
    );
  }
}

export default withRouter<any, typeof DialogProvider>(DialogProvider);

export const Consumer = ContextConsumer;
