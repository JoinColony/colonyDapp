/* @flow */

// $FlowFixMe Update flow
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import { Form, FormStatus, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { ActionFileUpload } from '~core/FileUpload';
import { ACTIONS } from '~redux';
import { mapPayload } from '~utils/actions';

import { getNormalizedDomainText } from '~utils/strings';

import styles from './StepCreateToken.css';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.heading',
    defaultMessage: 'Create new token for {colony}',
  },
  learnMoreLink: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.learnMoreLink',
    defaultMessage: 'Learn More',
  },
  nextButton: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.confirmButton',
    defaultMessage: 'Continue',
  },
  backButton: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.backButton',
    defaultMessage: 'Back',
  },
  labelTokenName: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.labelTokenName',
    defaultMessage: 'Token Name',
  },
  labelTokenSymbol: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.labelTokenSymbol',
    defaultMessage: 'Token Symbol',
  },
  helpTokenSymbol: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.helpTokenSymbol',
    defaultMessage: 'E.g.: (MAT), up to 4 characters',
  },
  helpTokenName: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.helpTokenName',
    defaultMessage: 'E.g.: My Awesome Token',
  },
  labelTokenIcon: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.labelTokenIcon',
    defaultMessage: 'Token Logo (optional)',
  },
  link: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.link',
    defaultMessage: 'I want to use an existing token',
  },
  errorCreateToken: {
    id: 'error.colony.createToken',
    defaultMessage: 'Could not create Token',
  },
  errorTokenSymbol: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.errorTokenSymbol',
    defaultMessage: `The token symbol can only contain letters and numbers, and
      can only have a length of 4`,
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
    .max(4, MSG.errorTokenSymbol),
  tokenIcon: yup.array().min(1, MSG.errorTokenIcon),
});

type FormValues = {
  tokenName: string,
  tokenSymbol: string,
  tokenAddress: string,
  colonyName: string,
  tokenChoice: string,
};

type Props = WizardProps<FormValues>;

const StepCreateToken = ({
  nextStep,
  previousStep,
  wizardForm,
  wizardValues,
}: Props) => {
  const transform = useCallback(
    mapPayload(({ data }) => ({ ipfsData: data })),
    [],
  );
  const goToTokenSelect = useCallback(
    () => {
      /* This is a custom link since it goes to a sibling step that appears
        to be parallel to this one after the wizard steps diverge,
        while making sure that the data form the previous wizard steps doesn't get lost
        TODO: there will be smoother solution or this, we already have an issue for it:
        https://github.com/JoinColony/colonyDapp/issues/1057
      */
      const wizardValuesCopy = Object.assign({}, wizardValues);
      previousStep(wizardValuesCopy);
      wizardValuesCopy.tokenChoice = 'select';
      nextStep(wizardValuesCopy);
    },
    [wizardValues, nextStep, previousStep],
  );
  const handleSubmit = useCallback(
    ({ tokenIcon, ...values }) =>
      nextStep({
        ...values,
        tokenIcon:
          tokenIcon && tokenIcon.length
            ? tokenIcon[0].uploaded.ipfsHash
            : undefined,
      }),
    [nextStep],
  );

  return (
    <Form
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      {...wizardForm}
    >
      {({ isSubmitting, isValid, status }) => (
        <div className={styles.main}>
          <section className={styles.titleSection}>
            <Heading
              appearance={{ size: 'medium', weight: 'bold' }}
              text={MSG.heading}
              textValues={{
                colony: getNormalizedDomainText(wizardValues.colonyName),
              }}
            />
          </section>
          <section className={styles.inputFields}>
            <div className={styles.inputFieldWrapper}>
              <Input
                name="tokenName"
                appearance={{ theme: 'fat' }}
                label={MSG.labelTokenName}
                help={MSG.helpTokenName}
                extra={
                  <button
                    type="button"
                    className={styles.linkToOtherStep}
                    tabIndex={-2}
                    onClick={goToTokenSelect}
                  >
                    <FormattedMessage {...MSG.link} />
                  </button>
                }
              />
            </div>
            <div className={styles.inputFieldWrapper}>
              <Input
                name="tokenSymbol"
                appearance={{ theme: 'fat' }}
                maxLength="4"
                formattingOptions={{ uppercase: true }}
                label={MSG.labelTokenSymbol}
                help={MSG.helpTokenSymbol}
              />
            </div>
            <div className={styles.inputFieldWrapper}>
              <ActionFileUpload
                accept={ACCEPTED_MIME_TYPES}
                maxFileSize={ACCEPTED_MAX_FILE_SIZE}
                name="tokenIcon"
                label={MSG.labelTokenIcon}
                submit={ACTIONS.IPFS_DATA_UPLOAD}
                success={ACTIONS.IPFS_DATA_UPLOAD_SUCCESS}
                error={ACTIONS.IPFS_DATA_UPLOAD_ERROR}
                transform={transform}
              />
            </div>
          </section>
          <FormStatus status={status} />
          <section className={styles.actionsContainer}>
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
    </Form>
  );
};

StepCreateToken.displayName = 'dashboard.CreateColonyWizard.CreateToken';

export default StepCreateToken;
