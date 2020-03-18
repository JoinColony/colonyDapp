import { FormikConfig, Formik, Form as FormikForm } from 'formik';
import React from 'react';

import SaveGuard from './SaveGuard';

interface Props extends FormikConfig<any> {
  saveGuard?: boolean;
}

const displayName = 'Form';

const Form = ({ children, saveGuard = false, ...props }: Props) => (
  <Formik {...props}>
    {injectedProps => (
      <FormikForm>
        {saveGuard && <SaveGuard />}
        {typeof children == 'function' ? children(injectedProps) : children}
      </FormikForm>
    )}
  </Formik>
);

Form.displayName = displayName;

export default Form;
