/* @flow */

import React from 'react';
import MakeAsyncFunction from 'react-redux-promise-listener';

import promiseListener from '../../../../createPromiseListener';
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
  let setPayloadFn;
  if (transform) {
    setPayloadFn = (action, payload) => {
      const newAction = transform({ ...action, payload });
      return { ...newAction, meta: { ...action.meta, ...newAction.meta } };
    };
  }
  return (
    <MakeAsyncFunction
      listener={promiseListener}
      start={submit}
      resolve={success}
      reject={error}
      setPayload={setPayloadFn}
    >
      {asyncFunc => <FileUpload upload={asyncFunc} {...props} />}
    </MakeAsyncFunction>
  );
};

export default ActionFileUpload;
