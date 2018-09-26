/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { SubmitFn } from '~core/Wizard';

import styles from './StepColonyName.css';

import Input from '~core/Fields/Input';
import Heading from '~core/Heading';
import Button from '~core/Button';

type FormValues = {
  colonyName: string,
};

type Props = {
  previousStep: () => void,
  nextStep: () => void,
} & FormikProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.heading',
    defaultMessage: 'What would you like to name your Colony?',
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.label',
    defaultMessage: 'Colony Name',
  },
  helpText: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.helpText',
    defaultMessage: 'So, this is some placeholder text',
  },
  placeholder: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.placeholder',
    defaultMessage: 'Type a display name for a colony',
  },
  cancel: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.cancel',
    defaultMessage: 'Cancel',
  },
  next: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.next',
    defaultMessage: 'Next',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepColonyName';

const StepColonyName = ({ handleSubmit, isValid }: Props) => (
  <section className={styles.content}>
    <div className={styles.title}>
      <Heading
        appearance={{ size: 'medium', weight: 'thin' }}
        text={MSG.heading}
      />
      <form className={styles.nameForm} onSubmit={handleSubmit}>
        <Input
          name="colonyName"
          label={MSG.label}
          placeholder={MSG.placeholder}
        />
        <div className={styles.buttons}>
          <Button
            appearance={{ theme: 'secondary' }}
            type="cancel"
            text={MSG.cancel}
          />
          <Button
            appearance={{ theme: 'primary' }}
            type="submit"
            disabled={!isValid}
            text={MSG.next}
          />
        </div>
      </form>
    </div>
  </section>
);

export const validationSchema = yup.object({
  colonyName: yup.string().required(),
});

StepColonyName.displayName = displayName;

export const Step = StepColonyName;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
