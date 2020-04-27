import { FormikBag, FormikProps, FormikHelpers, FormikErrors } from 'formik';
import React from 'react';
import { defineMessages } from 'react-intl';

import { ActionTypeString } from '~redux/index';
import { ActionTransformFnType } from '~utils/actions';
import { log } from '~utils/debug';
import { useAsyncFunction } from '~utils/hooks';
import Form from './Form';

const MSG = defineMessages({
  defaultError: {
    id: 'ActionForm.defaultError',
    defaultMessage:
      // eslint-disable-next-line max-len
      "Something went wrong with the thing you just wanted to do. It's not your fault. Promise!",
  },
});

const displayName = 'Form.ActionForm';

export type OnError = (
  error: any,
  bag: FormikBag<any, any>,
  values?: any,
) => void;
export type OnSuccess = (
  result: any,
  bag: FormikBag<any, any>,
  values: any,
) => void;

interface ExtendedFormikConfig {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  enableReinitialize?: boolean;
  component?: React.ComponentType<FormikProps<any>> | React.ReactNode;
  render?: (props: FormikProps<any>) => React.ReactNode;
  children?: ((props: FormikProps<any>) => React.ReactNode) | React.ReactNode;
  initialValues: any;
  initialStatus?: any;
  onReset?: (values: any, formikActions: FormikHelpers<any>) => void;
  onSubmit?: (values: any, formikActions: FormikHelpers<any>) => void;
  validationSchema?: any | (() => any);
  validate?: (values: any) => void | object | Promise<FormikErrors<any>>;
}

interface Props extends ExtendedFormikConfig {
  /** Redux action to dispatch on submit (e.g. CREATE_XXX) */
  submit: ActionTypeString;

  /** Redux action listener for successful action (e.g. CREATE_XXX_SUCCESS) */
  success: ActionTypeString;

  /** Redux action listener for unsuccessful action (e.g. CREATE_XXX_ERROR) */
  error: ActionTypeString;

  /** Function to call after successful action was dispatched */
  onSuccess?: OnSuccess;

  /** Function to call after error action was dispatched */
  onError?: OnError;

  /** A function to transform the action after the form data was passed in (as payload) */
  transform?: ActionTransformFnType;
}

const defaultOnError: OnError = (err, { setStatus }) => {
  log.error(err);
  setStatus({ error: MSG.defaultError });
};

const defaultOnSuccess: OnSuccess = (err, { setStatus }) => {
  setStatus({});
};

const ActionForm = ({
  submit,
  success,
  error,
  onSuccess = defaultOnSuccess,
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
  const handleSubmit = (values, formikBag) => {
    formikBag.setStatus({});
    asyncFunction(values).then(
      (res) => {
        formikBag.setSubmitting(false);
        if (typeof onSuccess === 'function') {
          onSuccess(res, formikBag, values);
        }
      },
      (err) => {
        formikBag.setSubmitting(false);
        if (typeof onError === 'function') onError(err, formikBag, values);
      },
    );
  };
  return <Form {...props} onSubmit={handleSubmit} />;
};

Form.displayName = displayName;

export default ActionForm;
