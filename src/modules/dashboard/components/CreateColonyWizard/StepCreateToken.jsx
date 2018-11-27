/* @flow */

import type { FormikBag } from 'formik';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import { ActionForm, FormStatus, Input } from '~core/Fields';

import Heading from '~core/Heading';
import Button from '~core/Button';
import FileUpload from '~core/FileUpload';
import ExternalLink from '~core/ExternalLink';

import styles from './StepCreateToken.css';

import {
  TOKEN_CREATE,
  TOKEN_CREATE_ERROR,
  TOKEN_CREATE_SUCCESS,
  TOKEN_ICON_UPLOAD,
  TOKEN_ICON_UPLOAD_ERROR,
  TOKEN_ICON_UPLOAD_SUCCESS,
} from '../../actionTypes';
import promiseListener from '../../../../createPromiseListener';

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

const ACCEPTED_MIME_TYPES: Array<string> = ['image/svg+xml', 'image/png'];
const ACCEPTED_MAX_FILE_SIZE: number = 1000000;

const validationSchema = yup.object({
  tokenName: yup.string().required(),
  tokenSymbol: yup
    .string()
    .required()
    .max(6, MSG.errorTokenSymbol),
  tokenIcon: yup
    .array()
    .required()
    .min(1, MSG.errorTokenIcon),
});

type FormValues = {
  tokenName: string,
  tokenSymbol: string,
  tokenAddress: string,
};

type Props = WizardProps<FormValues>;

class StepCreateToken extends Component<Props> {
  uploadTokenIcon: (file: *) => Promise<any>;

  displayName = 'dashboard.CreateColonyWizard.CreateToken';

  constructor(props: Props) {
    super(props);
    this.uploadTokenIcon = promiseListener.createAsyncFunction({
      start: TOKEN_ICON_UPLOAD,
      resolve: TOKEN_ICON_UPLOAD_SUCCESS,
      reject: TOKEN_ICON_UPLOAD_ERROR,
    });
  }

  componentWillUnmount() {
    this.uploadTokenIcon.unsubscribe();
  }

  render() {
    const { nextStep, previousStep, wizardForm } = this.props;
    const uploadTokenIcon = this.uploadTokenIcon.asyncFunction;

    return (
      <ActionForm
        submit={TOKEN_CREATE}
        error={TOKEN_CREATE_ERROR}
        success={TOKEN_CREATE_SUCCESS}
        onSuccess={({ receipt: { contractAddress } }, bag, values) => {
          nextStep({
            ...values,
            tokenAddress: contractAddress,
            tokenIcon: values.tokenIcon[0].uploaded.hash,
          });
        }}
        onError={(_: Object, { setStatus }: FormikBag<Object, FormValues>) =>
          setStatus({ error: MSG.errorCreateToken })
        }
        validationSchema={validationSchema}
        {...wizardForm}
      >
        {({ isSubmitting, isValid, status, values }) => (
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
                />
              </div>
              <div className={styles.inputFieldWrapper}>
                <Input
                  name="tokenSymbol"
                  appearance={{ theme: 'fat' }}
                  label={MSG.labelTokenSymbol}
                  help={MSG.helpTokenSymbol}
                />
              </div>
              <div className={styles.inputFieldWrapper}>
                <FileUpload
                  accept={ACCEPTED_MIME_TYPES}
                  maxFileSize={ACCEPTED_MAX_FILE_SIZE}
                  name="tokenIcon"
                  label={MSG.labelTokenIcon}
                  help={MSG.helpTokenIcon}
                  upload={uploadTokenIcon}
                />
              </div>
            </section>
            <FormStatus status={status} />
            <section className={styles.actionsContainer}>
              <Button
                text={MSG.backButton}
                appearance={{ theme: 'secondary', size: 'large' }}
                onClick={() => previousStep(values)}
                disabled={isSubmitting}
              />
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                text={MSG.nextButton}
                type="submit"
                disabled={!isValid}
                loading={isSubmitting}
              />
            </section>
          </div>
        )}
      </ActionForm>
    );
  }
}

export default StepCreateToken;
