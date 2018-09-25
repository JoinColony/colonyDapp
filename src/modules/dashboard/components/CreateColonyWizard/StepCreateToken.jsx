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
    id: 'CreateColony.StepCreateToken.heading',
    defaultMessage: 'Lets create your new token',
  },
  labelCreateColony: {
    id: 'CreateColony.StepCreateToken.label.createColony',
    defaultMessage: 'Token Contact Address',
  },
  helpText: {
    id: 'CreateColony.StepCreateToken.learnMore',
    defaultMessage: 'Learn More',
  },
  hint: {
    id: 'CreateColony.StepCreateToken.hint',
    defaultMessage: 'You can find them here https://etherscan.io/tokens',
  },
  cancel: {
    id: 'CreateColony.StepCreateToken.back',
    defaultMessage: 'Back',
  },
  next: {
    id: 'CreateColony.StepCreateToken.next',
    defaultMessage: 'Next',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepCreateToken';

const CreateToken = ({ handleSubmit }: Props) => (
  <section className={styles.content}>
    <div className={styles.title}>
      <Heading
        appearance={{ size: 'medium', weight: 'thin' }}
        text={MSG.heading}
      />
      <form className={styles.nameForm} onSubmit={handleSubmit}>
        <InputLabel label={MSG.labelCreateColony} />
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

CreateToken.displayName = displayName;

export const Step = CreateToken;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
