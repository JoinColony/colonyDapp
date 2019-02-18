/* @flow */

import type { FormikConfig, FormikBag } from 'formik';

import type { ActionTypeString, UniqueActionType } from '~redux';

import React from 'react';
import { defineMessages } from 'react-intl';
import MakeAsyncFunction from 'react-redux-promise-listener';

import promiseListener from '../../../../../createPromiseListener';

import Form from './Form.jsx';

const MSG = defineMessages({
  defaultError: {
    id: 'ActionForm.defaultError',
    defaultMessage:
      // eslint-disable-next-line max-len
      "Something went wrong with the thing you just wanted to do. It's not your fault. Promise!",
  },
});

const displayName = 'Form.ActionForm';

// We remove the onSubmit function from the props as it is provided by the ActionForm itself
type ActionFormikConfig = $Rest<FormikConfig<Object>, {| onSubmit: Function |}>;

type OnError = (
  error: any,
  bag: FormikBag<Object, Object>,
  values?: Object,
) => void;

type Props = ActionFormikConfig & {
  /** Redux action to dispatch on submit (e.g. CREATE_XXX) */
  submit: ActionTypeString,
  /** Redux action listener for successful action (e.g. CREATE_XXX_SUCCESS) */
  success: ActionTypeString,
  /** Redux action listener for unsuccessful action (e.g. CREATE_XXX_ERROR) */
  error: ActionTypeString,
  /** Function to call after successful action was dispatched */
  onSuccess?: (
    result: any,
    bag: FormikBag<Object, Object>,
    values: Object,
  ) => void,
  /** Function to call after error action was dispatched */
  onError?: OnError,
  /** A function to set the payload (the parameter passed to the async function). Defaults to (action, payload) => ({ ...action, payload }) */
  setPayload?: (
    action: Object | UniqueActionType<*, *, *>,
    payload: any,
  ) => UniqueActionType<*, *, Object>,
};

const defaultOnErrror: OnError = (err, { setStatus }) =>
  setStatus({ error: MSG.defaultError });

const ActionForm = ({
  submit,
  success,
  error,
  onSuccess,
  onError = defaultOnErrror,
  setPayload,
  ...props
}: Props) => (
  <MakeAsyncFunction
    listener={promiseListener}
    start={submit}
    resolve={success}
    reject={error}
    setPayload={setPayload}
  >
    {asyncFunc => {
      const handleSubmit = (values, formikBag) =>
        asyncFunc(values, formikBag).then(
          res => {
            formikBag.setSubmitting(false);
            if (typeof onSuccess === 'function') {
              onSuccess(res, formikBag, values);
            }
          },
          err => {
            formikBag.setSubmitting(false);
            if (typeof onError === 'function') onError(err, formikBag, values);
          },
        );
      return <Form {...props} onSubmit={handleSubmit} />;
    }}
  </MakeAsyncFunction>
);

Form.displayName = displayName;

export default ActionForm;
