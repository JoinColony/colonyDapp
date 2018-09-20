/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './CreateNewToken.css';

import type { SubmitFn } from '../../../core/components/Wizard';

import { Input } from '../../../core/components/Fields';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';
import FileUpload from '../../../core/components/FileUpload';

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
  helpNewToken: {
    id: 'CreateNewToken.helpNewToken',
    defaultMessage:
      '1. Please only use letters, number, periods, hyphens, and underscores.',
  },
  labelTokenSymbol: {
    id: 'CreateNewToken.labelTokenSymbol',
    defaultMessage: 'Token Symbol (example: CLNY)',
  },
  helpTokenSymbol: {
    id: 'CreateNewToken.helpTokenSymbol',
    defaultMessage: 'Max of 6 characters',
  },
  labelTokenIcon: {
    id: 'CreateNewToken.labelTokenIcon',
    defaultMessage: 'Token Icon (.svg or .png)',
  },
  helpTokenIcon: {
    id: 'CreateNewToken.helpTokenIcon',
    defaultMessage:
      'Recommended size for .png file is 60px by 60px, up to 1 MB',
  },
});

type FormValues = {
  tokenName: string,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

const ACCEPTED_MIME_TYPES: Array<string> = ['image/svg+xml', 'image/png'];
const ACCEPTED_MAX_FILE_SIZE: number = 1000000;

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
      <p className={styles.customInputHelp}>
        <FormattedMessage {...MSG.helpNewToken} />
      </p>
      <Input
        name="tokenSymbol"
        appearance={{ theme: 'fat' }}
        label={MSG.labelTokenSymbol}
      />
      <p className={styles.customInputHelp}>
        <FormattedMessage {...MSG.helpTokenSymbol} />
      </p>
      <FileUpload
        accept={ACCEPTED_MIME_TYPES}
        maxFileSize={ACCEPTED_MAX_FILE_SIZE}
        name="tokenIcon"
        label={MSG.labelTokenIcon}
      />
      <p className={styles.customInputHelp}>
        <FormattedMessage {...MSG.helpTokenIcon} />
      </p>
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
