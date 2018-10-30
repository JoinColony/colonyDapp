/* @flow */
import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { ActionSubmit } from '~core/Wizard';

import { Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import FileUpload from '~core/FileUpload';
import ExternalLink from '~core/ExternalLink';

import styles from './StepCreateToken.css';

import CreatingToken from './CreatingToken.jsx';
import {
  TOKEN_CREATE,
  TOKEN_CREATE_ERROR,
  TOKEN_CREATE_SUCCESS,
} from '../../actionTypes';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.heading',
    defaultMessage: "Let's create your new token.",
  },
  learnMoreLink: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.learnMoreLink',
    defaultMessage: 'Learn More',
  },
  nextButton: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.confirmButton',
    defaultMessage: 'Create Token',
  },
  backButton: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.backButton',
    defaultMessage: 'Back',
  },
  labelTokenName: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.labelTokenName',
    defaultMessage: 'Token Name (example: Colony Token)',
  },
  helpTokenName: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.helpTokenName',
    defaultMessage: 'Letters, numbers, periods, hyphens, and underscores.',
  },
  labelTokenSymbol: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.labelTokenSymbol',
    defaultMessage: 'Token Symbol (example: CLNY)',
  },
  helpTokenSymbol: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.helpTokenSymbol',
    defaultMessage: 'Max of 6 characters',
  },
  labelTokenIcon: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.labelTokenIcon',
    defaultMessage: 'Token Icon (.svg or .png)',
  },
  helpTokenIcon: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.helpTokenIcon',
    defaultMessage: 'Recommended 60px by 60px, up to 1 MB',
  },
  errorCreateToken: {
    id: 'error.colony.createToken',
    defaultMessage: 'Could not create Token',
  },
  errorTokenName: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.errorTokenName',
    defaultMessage: `The token name can only contain letters, numbers, periods,
      hyphens, and underscores`,
  },
  errorTokenSymbol: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.errorTokenSymbol',
    defaultMessage: `The token symbol can only contain letters and numbers, and
      can only have a length of 6`,
  },
  errorTokenIcon: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.errorTokenIcon',
    defaultMessage: `The token icon could not be uploaded. You can only upload
    .svg and .png images, up to 1 MB in size.`,
  },
});

type FormValues = {
  tokenName: string,
  tokenSymbol: string,
  tokenAddress: string,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

const ACCEPTED_MIME_TYPES: Array<string> = ['image/svg+xml', 'image/png'];
const ACCEPTED_MAX_FILE_SIZE: number = 1000000;

const VALIDATE_TOKEN_NAME: RegExp = /^[A-Za-z0-9-_.]+$/;

const StepCreateToken = ({ isSubmitting, isValid, previousStep }: Props) => (
  <Fragment>
    {isSubmitting ? (
      <CreatingToken />
    ) : (
      <div className={styles.main}>
        <section className={styles.titleSection}>
          <Heading className={styles.customHeading} text={MSG.heading} />
          <ExternalLink text={MSG.learnMoreLink} href="#" />
        </section>
        <section className={styles.inputFields}>
          <div className={styles.inputFieldWrapper}>
            <Input
              name="tokenName"
              appearance={{ theme: 'fat' }}
              label={MSG.labelTokenName}
              extra={<FormattedMessage {...MSG.helpTokenName} />}
            />
          </div>
          <div className={styles.inputFieldWrapper}>
            <Input
              name="tokenSymbol"
              appearance={{ theme: 'fat' }}
              label={MSG.labelTokenSymbol}
              extra={<FormattedMessage {...MSG.helpTokenSymbol} />}
            />
          </div>
          <div className={styles.inputFieldWrapper}>
            <FileUpload
              accept={ACCEPTED_MIME_TYPES}
              maxFileSize={ACCEPTED_MAX_FILE_SIZE}
              name="tokenIcon"
              label={MSG.labelTokenIcon}
              extra={<FormattedMessage {...MSG.helpTokenIcon} />}
            />
          </div>
        </section>
        <section className={styles.actionsContainer}>
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
            disabled={!isValid}
          />
        </section>
      </div>
    )}
  </Fragment>
);

StepCreateToken.displayName = 'dashboard.CreateColonyWizard.CreateToken';

export const validationSchema = yup.object({
  tokenName: yup
    .string()
    .required()
    .matches(VALIDATE_TOKEN_NAME, MSG.errorTokenName),
  tokenSymbol: yup
    .string()
    .required()
    .max(6, MSG.errorTokenSymbol),
  tokenIcon: yup.array().min(1, MSG.errorTokenIcon),
});

export const onSubmit: ActionSubmit<{
  tokenAddress: string,
  tokenIcon: Array<string>,
  tokenName: string,
  tokenSymbol: string,
}> = {
  submit: TOKEN_CREATE,
  error: TOKEN_CREATE_ERROR,
  success: TOKEN_CREATE_SUCCESS,
  setPayload(action: *, { tokenName: name, tokenSymbol: symbol }: *) {
    return {
      ...action,
      payload: {
        params: { name, symbol },
      },
    };
  },
  // eslint-disable-next-line no-unused-vars
  onError(error: *, bag: *) {
    // TODO later: show error feedback
    console.warn(error); // eslint-disable-line no-console
  },
  onSuccess({ receipt: { contractAddress } }, { nextStep, setFieldValue }) {
    setFieldValue('tokenAddress', contractAddress);
    nextStep();
  },
};

export const Step = StepCreateToken;
