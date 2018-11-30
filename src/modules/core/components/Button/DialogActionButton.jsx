/* @flow */

import React, { Component } from 'react';

import type { MessageDescriptor } from 'react-intl';

import withDialog from '~core/Dialog/withDialog';
import Button from '~core/Button';

import type { OpenDialog } from '~core/Dialog/types';

import promiseListener from '../../../../createPromiseListener';

type Props = {
  openDialog: OpenDialog,
  dialog: string,
  options: Object,
  submit: string,
  success: string,
  error: string,
  text: MessageDescriptor | string,
  additionalValues?: Object,
};

type State = {
  loading: boolean,
};

class DialogActionButton extends Component<Props, State> {
  asyncFunc: (values: Object) => void;

  constructor(props: Props) {
    super(props);
    const { submit, success, error } = props;
    this.asyncFunc = promiseListener.createAsyncFunction({
      start: submit,
      resolve: success,
      reject: error,
    });
  }

  state = {
    loading: false,
  };

  componentWillUnmount() {
    this.asyncFunc.unsubscribe();
  }

  onClick = async () => {
    try {
      const { openDialog, dialog, options, additionalValues = {} } = this.props;
      const values = await openDialog(dialog, options).afterClosed();
      this.setState({ loading: true });
      await this.asyncFunc.asyncFunction({ ...values, ...additionalValues });
      this.setState({ loading: false });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
      // TODO: display error somewhere
    }
  };

  render() {
    const { text } = this.props;
    const { loading } = this.state;
    return <Button text={text} onClick={this.onClick} loading={loading} />;
  }
}

export default withDialog()(DialogActionButton);
