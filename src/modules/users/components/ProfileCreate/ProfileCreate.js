/* @flow */
import type { FormikProps, FormikBag } from 'formik';

import { createElement } from 'react';
import { withFormik } from 'formik';
import { compose, withHandlers } from 'recompose';

import type { FormValues } from './types';

import ProfileCreateForm, { validationSchema } from './ProfileCreateForm.jsx';
import WizardTemplate from '~pages/WizardTemplate';

type Props = {
  handleBack: () => void,
} & FormikProps<FormValues>;

const ProfileCreate = (props: Props) =>
  createElement(
    WizardTemplate,
    {},
    createElement(ProfileCreateForm, { ...props }),
  );

const enhance = compose(
  withFormik({
    mapPropsToValues: () => ({
      profilename: '',
    }),
    handleSubmit: (values: FormValues, formikBag: FormikBag<Object, *>) => {
      const {
        props: { history },
      } = formikBag;
      // TODO handle submitting data here
      history.push('/');
    },
    validationSchema,
  }),
  withHandlers({
    handleBack: props => () => {
      const { history } = props;
      history.push('/start');
    },
  }),
);

export default enhance(ProfileCreate);
