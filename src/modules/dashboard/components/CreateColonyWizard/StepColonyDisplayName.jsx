/* @flow */
import type { ContextRouter } from 'react-router-dom';

import React from 'react';
import { defineMessages } from 'react-intl';
import { withRouter } from 'react-router-dom';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import styles from './StepColonyDisplayName.css';

import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepColonyDisplayName.heading',
    defaultMessage: 'What would you like to name your Colony?',
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepColonyDisplayName.label',
    defaultMessage: 'Colony Name',
  },
  helpText: {
    id: 'dashboard.CreateColonyWizard.StepColonyDisplayName.helpText',
    defaultMessage: 'So, this is some placeholder text',
  },
  placeholder: {
    id: 'dashboard.CreateColonyWizard.StepColonyDisplayName.placeholder',
    defaultMessage: 'Type a display name for a colony',
  },
  cancel: {
    id: 'dashboard.CreateColonyWizard.StepColonyDisplayName.cancel',
    defaultMessage: 'Cancel',
  },
  next: {
    id: 'dashboard.CreateColonyWizard.StepColonyDisplayName.next',
    defaultMessage: 'Next',
  },
});

const validationSchema = yup.object({
  displayName: yup.string().required(),
});

type FormValues = {
  displayName: string,
};

type Props = WizardProps<FormValues> & ContextRouter;

const displayName = 'dashboard.CreateColonyWizard.StepColonyDisplayName';

const StepColonyDisplayName = ({
  nextStep,
  wizardForm,
  history: { goBack },
}: Props) => (
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
              name="displayName"
              label={MSG.label}
              placeholder={MSG.placeholder}
            />
            <div className={styles.buttons}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                text={MSG.cancel}
                onClick={goBack}
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

StepColonyDisplayName.displayName = displayName;

export default withRouter(StepColonyDisplayName);
