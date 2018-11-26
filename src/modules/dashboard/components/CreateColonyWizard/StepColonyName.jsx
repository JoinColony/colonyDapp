/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import styles from './StepColonyName.css';

import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';

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

const validationSchema = yup.object({
  colonyName: yup.string().required(),
});

type FormValues = {
  colonyName: string,
};

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepColonyName';

const StepColonyName = ({ nextStep, wizardForm }: Props) => (
  <Form onSubmit={nextStep} validationSchema={validationSchema} {...wizardForm}>
    {({ isValid }) => (
      <section className={styles.main}>
        <div className={styles.title}>
          <Heading
            appearance={{ size: 'medium', weight: 'thin' }}
            text={MSG.heading}
          />
          <div className={styles.nameForm}>
            <Input
              appearance={{ theme: 'fat' }}
              name="colonyName"
              label={MSG.label}
              placeholder={MSG.placeholder}
            />
            <div className={styles.buttons}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                text={MSG.cancel}
              />
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                type="submit"
                disabled={!isValid}
                text={MSG.next}
              />
            </div>
          </div>
        </div>
      </section>
    )}
  </Form>
);

StepColonyName.displayName = displayName;

export default StepColonyName;
