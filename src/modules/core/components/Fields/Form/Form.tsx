import { FormikConfig, Formik, Form as FormikForm } from 'formik';
import React from 'react';

const displayName = 'Form';

interface Props extends FormikConfig<any> {
  className?: string;
}

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
