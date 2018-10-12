/* @flow */

import type { FormikConfig } from 'formik';

import React from 'react';
import { Formik, Form as FormikForm } from 'formik';

const displayName = 'Form';

const Form = ({ children, ...props }: FormikConfig<Object>) => (
  <Formik {...props}>
    {injectedProps => (
      <FormikForm>
        {typeof children == 'function' ? children(injectedProps) : children}
      </FormikForm>
    )}
  </Formik>
);

Form.displayName = displayName;

export default Form;
