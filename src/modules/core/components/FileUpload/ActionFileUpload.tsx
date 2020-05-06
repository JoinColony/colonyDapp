import React from 'react';

import { useAsyncFunction } from '~utils/hooks';

import FileUpload from './FileUpload';

import { ActionTransformFnType } from '~utils/actions';

interface Props {
  submit: string;
  success: string;
  error: string;
  transform?: ActionTransformFnType;
  accept?: string[];
  maxFileSize?: number;
  name: string;
  label?: any;
  status?: any;
}

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
