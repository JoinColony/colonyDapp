/* @flow */

import React, { Component } from 'react';

import promiseListener from '../../../createPromiseListener';
import FileUpload from './FileUpload.jsx';

import type { AsyncFunction } from '../../../createPromiseListener';

// TODO if this object is sealed, there are unspecified props being used
type Props = {
  submit: string,
  success: string,
  error: string,
};

class ActionFileUpload extends Component<Props> {
  upload: AsyncFunction<void, void>;

  constructor(props: Props) {
    super(props);
    const { submit, success, error } = this.props;
    this.upload = promiseListener.createAsyncFunction({
      start: submit,
      resolve: success,
      reject: error,
    });
  }

  componentWillUnmount() {
    this.upload.unsubscribe();
  }

  render() {
    const { submit, success, error, ...props } = this.props;
    return <FileUpload upload={this.upload.asyncFunction} {...props} />;
  }
}

export default ActionFileUpload;
