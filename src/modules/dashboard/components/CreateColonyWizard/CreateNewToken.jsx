/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';

import styles from './CreateNewToken.css';

import type { SubmitFn } from '../../../core/components/Wizard';

import { Input } from '../../../core/components/Fields';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

const MSG = defineMessages({
  heading: {
    id: 'CreateNewToken.heading',
    defaultMessage: "Let's create your new token",
  },
  nextButton: {
    id: 'CreateNewToken.confirmButton',
    defaultMessage: 'Create Token',
  },
  backButton: {
    id: 'CreateNewToken.backButton',
    defaultMessage: 'Back',
  },
  labelNewToken: {
    id: 'CreateNewToken.labelNewToken',
    defaultMessage: 'Token Name (example: Colony Token)',
  },
});

type FormValues = {
  tokenName: string,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

const displayName: string = 'createColonyWizard.CreateNewToken';

const CreateNewToken = ({ previousStep, handleSubmit }: Props) => (
  <form className={styles.main} onSubmit={handleSubmit}>
    <section className={styles.titleSection}>
      <Heading
        appearance={{ size: 'medium', weight: 'thin' }}
        text={MSG.heading}
      />
    </section>
    <div className={styles.inputFields}>
      <Input
        name="tokenName"
        appearance={{ theme: 'fat' }}
        label={MSG.labelNewToken}
      />
    </div>
    <div className={styles.actionsContainer}>
      <Button
        text={MSG.backButton}
        appearance={{ theme: 'secondary', size: 'large' }}
        onClick={previousStep}
      />
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        text={MSG.nextButton}
        type="submit"
        style={{ width: styles.wideButton }}
      />
    </div>
  </form>
);

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

CreateNewToken.displayName = displayName;

export const Step = CreateNewToken;
