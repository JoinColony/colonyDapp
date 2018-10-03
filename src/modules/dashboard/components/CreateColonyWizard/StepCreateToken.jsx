/* @flow */
import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { SubmitFn } from '~core/Wizard';

import { Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import FileUpload from '~core/FileUpload';
import ExternalLink from '~core/ExternalLink';

import styles from './StepCreateToken.css';

import CreatingToken from './CreatingToken.jsx';

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
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

type State = {
  isCreatingToken: boolean,
};

const ACCEPTED_MIME_TYPES: Array<string> = ['image/svg+xml', 'image/png'];
const ACCEPTED_MAX_FILE_SIZE: number = 1000000;

const VALIDATE_TOKEN_NAME: RegExp = /^[A-Za-z0-9-_.]+$/;

class StepCreateToken extends Component<Props, State> {
  timeoutId: TimeoutID;

  static displayName = 'dashboard.CreateColonyWizard.CreateToken';

  constructor(props: Props) {
    super(props);
    this.state = {
      isCreatingToken: false,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  handleTokenCreate = (e: SyntheticEvent<any>) => {
    const { handleSubmit } = this.props;
    // TODO actually create a token here - this is currently waiting to submit the form,
    // as it's just mocking creation to show the loading screen
    e.persist();
    this.setState({ isCreatingToken: true });
    this.timeoutId = setTimeout(() => {
      handleSubmit(e);
    }, 5000);
  };

  render() {
    const { previousStep, isValid } = this.props;
    const { isCreatingToken } = this.state;
    return (
      <Fragment>
        {isCreatingToken ? (
          <CreatingToken />
        ) : (
          <form className={styles.main} onSubmit={this.handleTokenCreate}>
            <section className={styles.titleSection}>
              <Heading className={styles.customHeading} text={MSG.heading} />
              <ExternalLink text={MSG.learnMoreLink} href="#" />
            </section>
            <div className={styles.inputFields}>
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
                disabled={!isValid}
              />
            </div>
          </form>
        )}
      </Fragment>
    );
  }
}

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

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = StepCreateToken;
