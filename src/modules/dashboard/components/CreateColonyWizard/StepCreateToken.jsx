/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';

import type { SubmitFn } from '~core/Wizard';

import styles from './StepCreateToken.css';

import Input from '~core/Fields/Input';
import InputLabel from '~core/Fields/InputLabel';
import Heading from '~core/Heading';
import Button from '~core/Button';

type FormValues = {
  tokenName: string,
};

type Props = {
  previousStep: () => void,
  nextStep: () => void,
} & FormikProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.heading',
    defaultMessage: 'Lets create your new token',
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.label',
    defaultMessage: 'Token Contact Address',
  },
  helpText: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.learnMore',
    defaultMessage: 'Learn More',
  },
  hint: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.hint',
    defaultMessage: 'You can find them here https://etherscan.io/tokens',
  },
  cancel: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.back',
    defaultMessage: 'Back',
  },
  next: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.next',
    defaultMessage: 'Next',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepCreateToken';

const StepCreateToken = ({ handleSubmit }: Props) => (
  <section className={styles.content}>
    <div className={styles.title}>
      <Heading
        appearance={{ size: 'medium', weight: 'thin' }}
        text={MSG.heading}
      />
      <form className={styles.nameForm} onSubmit={handleSubmit}>
        <InputLabel label={MSG.label} />
        <Input name="tokenName" appearance={{ width: 'full' }} />
        <div className={styles.buttons}>
          <Button
            appearance={{ theme: 'secondary' }}
            type="cancel"
            text={MSG.cancel}
          />
          <Button
            appearance={{ theme: 'primary' }}
            type="submit"
            text={MSG.next}
          />
        </div>
      </form>
    </div>
  </section>
);

StepCreateToken.displayName = displayName;

export const Step = StepCreateToken;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
