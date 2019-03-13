/* @flow */

import type { ComponentType } from 'react';

import React, { Component } from 'react';

import { log } from '~utils/debug';
import DefaultButton from '~core/Button';

import promiseListener from '../../../../createPromiseListener';

import type { AsyncFunction } from '../../../../createPromiseListener';

// TODO if this object is sealed, there are unspecified props being used
type Props = {
  submit: string,
  success: string,
  error: string,
  values?: Object | (() => Object | Promise<Object>),
  button?: ComponentType<*>,
};

type State = {|
  loading: boolean,
|};

class ActionButton extends Component<Props, State> {
  asyncFunc: AsyncFunction<Object, void>;

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

  handleClick = async () => {
    try {
      const { values: valuesProp = {} } = this.props;
      const values =
        typeof valuesProp === 'function' ? await valuesProp() : valuesProp;
      this.setState({ loading: true });
      await this.asyncFunc.asyncFunction(values);
      this.setState({ loading: false });
    } catch (error) {
      log(error);
      this.setState({ loading: false });
      // TODO: display error somewhere
    }
  };

  render() {
    const {
      submit,
      success,
      error,
      values,
      button: Button = DefaultButton,
      ...props
    } = this.props;
    const { loading } = this.state;
    return <Button onClick={this.handleClick} loading={loading} {...props} />;
  }
}

export default ActionButton;
