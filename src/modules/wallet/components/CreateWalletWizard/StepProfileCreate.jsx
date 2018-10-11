/* @flow */

import type { FormikProps } from 'formik';

import { createElement } from 'react';
import { mapProps } from 'recompose';

import type { FormValues } from '../ProfileCreate/types';
import type { SubmitFn } from '../../../core/components/Wizard';

import ProfileCreateForm from '../ProfileCreate/ProfileCreateForm.jsx';

type OutProps = {
  handleBack: () => void,
} & FormikProps<FormValues>;

type InProps = {
  previousStep: () => void,
} & FormikProps<FormValues>;

const StepProfileCreate = (props: OutProps) =>
  createElement(ProfileCreateForm, { ...props });

// TODO: submit function
export const onSubmit: SubmitFn<FormValues> = () => null;

const enhance = mapProps(
  ({ previousStep, ...props }: InProps): OutProps => ({
    handleBack: previousStep,
    ...props,
  }),
);

export const formikConfig = {
  initialValues: {
    profilename: '',
  },
};

export const Step = enhance(StepProfileCreate);
