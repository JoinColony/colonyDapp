/* @flow */

import type { FormikConfig, FormikBag } from 'formik';

import React from 'react';
import MakeAsyncFunction from 'react-redux-promise-listener';

import promiseListener from '../../../../../createPromiseListener';

import Form from './Form.jsx';

const displayName = 'Form.ActionForm';

type Props = FormikConfig<Object> & {
  submit: string,
  success: string,
  error: string,
  onSuccess?: (any, FormikBag<Object, Object>) => void,
  onError?: (any, FormikBag<Object, Object>) => void,
};

const ActionForm = ({
  submit,
  success,
  error,
  onSuccess,
  onError,
  ...props
}: Props) => (
  <MakeAsyncFunction
    listener={promiseListener}
    start={submit}
    resolve={success}
    reject={error}
  >
    {asyncFunc => {
      const handleSubmit = (values, formikBag) =>
        asyncFunc(values, formikBag).then(
          res => {
            formikBag.setSubmitting(false);
            if (typeof onSuccess == 'function') {
              onSuccess(res, formikBag);
            }
          },
          err => {
            formikBag.setSubmitting(false);
            if (typeof onError == 'function') {
              onError(err, formikBag);
            }
          },
        );
      return <Form {...props} onSubmit={handleSubmit} />;
    }}
  </MakeAsyncFunction>
);

Form.displayName = displayName;

export default ActionForm;
