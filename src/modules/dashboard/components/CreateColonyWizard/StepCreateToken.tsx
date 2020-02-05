import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { WizardProps } from '~core/Wizard';
import { Form, FormStatus, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { multiLineTextEllipsis } from '~utils/strings';
import ENS from '~lib/ENS';
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
    defaultMessage: '(e.g., MAT, AMEX)',
  },
  helpTokenName: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.helpTokenName',
    defaultMessage: '(e.g., My Awesome Token)',
  },
  labelTokenIcon: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.labelTokenIcon',
    defaultMessage: 'Token Icon (Optional)',
  },
  tokenIconHint: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.tokenIconHint',
    defaultMessage: 'Recommended format: .png or .svg',
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
      can only have a length of 5`,
  },
  errorTokenIcon: {
    id: 'dashboard.CreateColonyWizard.StepCreateToken.errorTokenIcon',
    defaultMessage: `The token icon could not be uploaded. You can only upload
    .svg and .png images, up to 1 MB in size.`,
  },
});

const validationSchema = yup.object({
  tokenName: yup.string().required(),
  tokenSymbol: yup
    .string()
    .required()
    .max(5, () => MSG.errorTokenSymbol),
  tokenIcon: yup.array().max(1, () => MSG.errorTokenIcon),
});

type FormValues = {
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  colonyName: string;
  tokenChoice: string;
};

type Props = WizardProps<FormValues>;

const StepCreateToken = ({
  nextStep,
  previousStep,
  stepCompleted,
  wizardForm,
  wizardValues,
}: Props) => {
  const goToTokenSelect = useCallback(() => {
    /* This is a custom link since it goes to a sibling step that appears
        to be parallel to this one after the wizard steps diverge,
        while making sure that the data form the previous wizard steps
        doesn't get lost
        TODO: there will be smoother solution or this:
        https://github.com/JoinColony/colonyDapp/issues/1057
      */
    const wizardValuesCopy = { ...wizardValues };
    previousStep();
    wizardValuesCopy.tokenChoice = 'select';
    nextStep(wizardValuesCopy);
  }, [wizardValues, nextStep, previousStep]);
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
      {({ dirty, isSubmitting, isValid, status }) => (
        <div className={styles.main}>
          <section className={styles.titleSection}>
            <Heading appearance={{ size: 'medium', weight: 'bold' }}>
              <FormattedMessage
                {...MSG.heading}
                values={{
                  /*
                   * @NOTE We need to use a JS string truncate here, rather then CSS,
                   * since we're dealing with a string that needs to be truncated,
                   * inside a sentence that does not
                   */
                  colony: (
                    <span title={ENS.normalizeAsText(wizardValues.colonyName)}>
                      {multiLineTextEllipsis(
                        ENS.normalizeAsText(wizardValues.colonyName),
                        40,
                      )}
                    </span>
                  ),
                }}
              />
            </Heading>
          </section>
          <section className={styles.inputFields}>
            <div className={styles.inputFieldWrapper}>
              <Input
                name="tokenName"
                appearance={{ theme: 'fat' }}
                label={MSG.labelTokenName}
                help={MSG.helpTokenName}
                data-test="defineTokenName"
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
                maxLength={5}
                data-test="defineTokenSymbol"
                formattingOptions={{ uppercase: true }}
                label={MSG.labelTokenSymbol}
                help={MSG.helpTokenSymbol}
              />
            </div>
          </section>
          <FormStatus status={status} />
          <section className={styles.actionsContainer}>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              text={MSG.nextButton}
              type="submit"
              data-test="definedTokenConfirm"
              disabled={!isValid || (!dirty && !stepCompleted)}
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
