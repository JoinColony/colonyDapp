/* @flow */

import type { FormikConfig, FormikBag } from 'formik';

import type { ActionTypeString } from '~redux';

import React from 'react';
import { defineMessages } from 'react-intl';

import type { ActionTransformFnType } from '~utils/actions';

import { log } from '~utils/debug';
import { useAsyncFunction } from '~utils/hooks';

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
  /** Function to call after submit action was dispatched */
  onSubmit?: (values: Object, bag: FormikBag<Object, Object>) => void,
  /** Function to call after successful action was dispatched */
  onSuccess?: (
    result: any,
    bag: FormikBag<Object, Object>,
    values: Object,
  ) => void,
  /** Function to call after error action was dispatched */
  onError?: OnError,
  /** A function to transform the action after the form data was passed in (as payload) */
  transform?: ActionTransformFnType,
};

const defaultOnError: OnError = (err, { setStatus }) => {
  log(err);
  setStatus({ error: MSG.defaultError });
};

const ActionForm = ({
  submit,
  success,
  error,
  onSubmit,
  onSuccess,
  onError = defaultOnError,
  transform,
  ...props
}: Props) => {
  const asyncFunction = useAsyncFunction({
    submit,
    error,
    success,
    transform,
  });
  const handleSubmit = (values, formikBag) =>
    asyncFunction(values).then(
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
};

Form.displayName = displayName;

export default ActionForm;
