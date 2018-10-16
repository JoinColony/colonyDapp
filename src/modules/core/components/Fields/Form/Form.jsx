/* @flow */

import type { FormikConfig } from 'formik';

import React from 'react';
import { Formik, Form as FormikForm } from 'formik';

const displayName = 'Form';

type Props = FormikConfig<Object>;

const Form = ({ children, ...props }: Props) => (
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
