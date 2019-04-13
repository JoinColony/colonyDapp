/* @flow */

import React from 'react';

import { useAsyncFunction } from '~utils/hooks';

import FileUpload from './FileUpload.jsx';

import type { ActionTransformFnType } from '~utils/actions';

// TODO if this object is sealed, there are unspecified props being used
type Props = {
  submit: string,
  success: string,
  error: string,
  transform?: ActionTransformFnType,
};

const ActionFileUpload = ({
  submit,
  success,
  error,
  transform,
  ...props
}: Props) => {
  const asyncFunction = useAsyncFunction({ submit, error, success, transform });
  return <FileUpload upload={asyncFunction} {...props} />;
};

export default ActionFileUpload;
