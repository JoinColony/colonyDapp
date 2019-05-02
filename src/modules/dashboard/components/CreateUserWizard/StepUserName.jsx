/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import styles from './StepUserName.css';

import { useAsyncFunction } from '~utils/hooks';
import { ActionForm, Input } from '~core/Fields';
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
    id: 'dashboard.CreateUserWizard.StepUserName.heading',
    defaultMessage: 'Welcome to Colony!',
  },
  descriptionOne: {
    id: 'dashboard.CreateUserWizard.StepUserName.descriptionOne',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Le’ts get your account set up. All we need is a username.',
  },
  label: {
    id: 'dashboard.CreateUserWizard.StepUserName.label',
    defaultMessage: 'Your Unique Username',
  },
  continue: {
    id: 'dashboard.CreateUserWizard.StepUserName.continue',
    defaultMessage: 'Continue',
  },
  gotETH: {
    id: 'dashboard.CreateUserWizard.StepUserName.gotETH',
    defaultMessage: `Got ETH? You'll need some at the end
      to cover Ethereum's transaction fees.`,
  },
  errorDomainTaken: {
    id: 'dashboard.CreateUserWizard.StepUserName.errorDomainTaken',
    defaultMessage: 'This Username is already taken',
  },
  errorDomainInvalid: {
    id: 'dashboard.CreateUserWizard.StepUserName.errorDomainInvalid',
    defaultMessage:
      'Invalid username. Please make sure this will be a valid domain',
  },
  tooltip: {
    id: 'dashboard.CreateUserWizard.StepUserName.tooltip',
    defaultMessage: `We use ENS to create a .joincolony.eth subdomain for
      your wallet address. This allows us to provide a good user experience
      while using a fully decentralized architecture.`,
  },
  statusText: {
    id: 'users.ENSNameDialog.statusText',
    defaultMessage: 'Actual Username: @{normalized}',
  },
});

const displayName = 'dashboard.CreateUserWizard.StepUserName';

const validationSchema = yup.object({
  username: yup
    .string()
    .required()
    .ensAddress(),
});

const StepUserName = ({ wizardValues, nextStep }: Props) => {
  const checkDomainTaken = useAsyncFunction({
    submit: ACTIONS.USERNAME_CHECK_AVAILABILITY,
    success: ACTIONS.USERNAME_CHECK_AVAILABILITY_SUCCESS,
    error: ACTIONS.USERNAME_CHECK_AVAILABILITY_ERROR,
  });
  const validateDomain = useCallback(
    async (values: FormValues) => {
      try {
        // Let's check whether this is even valid first
        validationSchema.validateSyncAt('username', values);
      } catch (caughtError) {
        // Just return. The actual validation will be done by the
        // validationSchema
        return;
      }
      try {
        await checkDomainTaken(values);
      } catch (e) {
        const error = {
          username: MSG.errorDomainTaken,
        };
        throw error;
      }
    },
    [checkDomainTaken],
  );
  return (
    <ActionForm
      submit={ACTIONS.USERNAME_CREATE}
      success={ACTIONS.USERNAME_CREATE_SUCCESS}
      error={ACTIONS.USERNAME_CREATE_ERROR}
      onSuccess={() => nextStep(wizardValues)}
      validate={validateDomain}
      validationSchema={validationSchema}
    >
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
    </ActionForm>
  );
};

StepUserName.displayName = displayName;

export default StepUserName;
