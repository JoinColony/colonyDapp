/* @flow */

import React, { Component } from 'react';

import type { MessageDescriptor } from 'react-intl';

import Button from '~core/Button';

import promiseListener from '../../../../createPromiseListener';

type Props = {
  submit: string,
  success: string,
  error: string,
  text: MessageDescriptor | string,
  setValues?: () => Object | Promise<Object>,
};

type State = {
  loading: boolean,
};

class ActionButton extends Component<Props, State> {
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
      const { setValues } = this.props;
      const values = setValues ? await setValues() : {};
      this.setState({ loading: true });
      await this.asyncFunc.asyncFunction(values);
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

export default ActionButton;
