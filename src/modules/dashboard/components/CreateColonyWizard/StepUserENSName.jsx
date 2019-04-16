/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import styles from './StepUserENSName.css';

import { useAsyncFunction } from '~utils/hooks';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { ACTIONS } from '~redux';

import { getNormalizedDomainText } from '~utils/strings';

type FormValues = {
  username: string,
};

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepUserENSName.heading',
    defaultMessage: 'Welcome to Colony!',
  },
  descriptionOne: {
    id: 'dashboard.CreateColonyWizard.StepUserENSName.descriptionOne',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Let’s start with the basics. What can we call you?',
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepUserENSName.label',
    defaultMessage: 'Your Unique Username',
  },
  continue: {
    id: 'dashboard.CreateColonyWizard.StepUserENSName.continue',
    defaultMessage: 'Continue',
  },
  gotETH: {
    id: 'dashboard.CreateColonyWizard.StepUserENSName.gotETH',
    defaultMessage: `Got ETH? You'll need some at the end
      to cover Ethereum's transaction fees.`,
  },
  errorDomainTaken: {
    id: 'dashboard.CreateColonyWizard.StepUserENSName.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
  errorDomainInvalid: {
    id: 'dashboard.CreateColonyWizard.StepColonyENSName.errorDomainInvalid',
    defaultMessage:
      'Invalid username. Please make sure this will be a valid domain',
  },
  tooltip: {
    id: 'dashboard.CreateColonyWizard.StepUserENSName.tooltip',
    defaultMessage: `We use ENS to create a .joincolony.eth subdomain for
      your wallet address. This allows us to provide a good user experience
      while using a fully decentralized architecture.`,
  },
  statusText: {
    id: 'users.ENSNameDialog.statusText',
    defaultMessage: 'Actual Username: @{normalized}',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepUserENSName';

const validationSchema = yup.object({
  username: yup
    .string()
    .required()
    .ensAddress(),
});

const StepUserENSName = ({ wizardForm, nextStep }: Props) => {
  const checkDomainTaken = useAsyncFunction({
    submit: ACTIONS.USERNAME_CHECK_AVAILABILITY,
    success: ACTIONS.USERNAME_CHECK_AVAILABILITY_SUCCESS,
    error: ACTIONS.USERNAME_CHECK_AVAILABILITY_ERROR,
  });

  const validateDomain = useCallback(
    async (values: FormValues) => {
      // 1. Validate with schema
      if (!validationSchema.isValidSync(values)) {
        const error = {
          username: MSG.errorDomainInvalid,
        };
        if (values.username) throw error;
      } else {
        // 2. Validate with saga
        try {
          await checkDomainTaken(values);
        } catch (e) {
          const error = {
            username: MSG.errorDomainTaken,
          };
          throw error;
        }
      }
    },
    [checkDomainTaken],
  );
  return (
    <Form onSubmit={nextStep} validate={validateDomain} {...wizardForm}>
      {({ isValid, isSubmitting, values: { username } }) => {
        const normalized = getNormalizedDomainText(username);
        return (
          <section className={styles.main}>
            <div className={styles.title}>
              <Heading appearance={{ size: 'medium' }} text={MSG.heading} />
              <p className={styles.paragraph}>
                <FormattedMessage {...MSG.descriptionOne} />
              </p>
              <div className={styles.nameForm}>
                <Input
                  appearance={{ theme: 'fat' }}
                  name="username"
                  label={MSG.label}
                  extensionString=".user.joincolony.eth"
                  status={normalized && MSG.statusText}
                  statusValues={{
                    normalized,
                  }}
                  data-test="claimUsernameInput"
                  extra={
                    <Tooltip
                      placement="right"
                      content={
                        <span className={styles.tooltip}>
                          <FormattedMessage {...MSG.tooltip} />
                        </span>
                      }
                    >
                      <div className={styles.iconContainer}>
                        <Icon
                          name="question-mark"
                          title="helper"
                          appearance={{ size: 'small' }}
                        />
                      </div>
                    </Tooltip>
                  }
                />
                <div className={styles.buttons}>
                  <p className={styles.reminder}>
                    <FormattedMessage {...MSG.gotETH} />
                  </p>
                  <Button
                    appearance={{ theme: 'primary', size: 'large' }}
                    type="submit"
                    disabled={!isValid}
                    loading={isSubmitting}
                    text={MSG.continue}
                  />
                </div>
              </div>
            </div>
          </section>
        );
      }}
    </Form>
  );
};

StepUserENSName.displayName = displayName;

export default StepUserENSName;
