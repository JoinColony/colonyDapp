/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { normalize as ensNormalize } from 'eth-ens-namehash-ms';

import type { WizardProps } from '~core/Wizard';

import styles from './StepUserENSName.css';

import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { ACTIONS } from '~redux';

import promiseListener from '../../../../createPromiseListener';

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
  tooltip: {
    id: 'dashboard.CreateColonyWizard.StepUserENSName.tooltip',
    defaultMessage: `We use ENS to create a .joincolony.eth subdomain for your wallet address.
      This allows us to provide a good user experience while using a fully decentralized architecture.`,
  },
  statusText: {
    id: 'users.ENSNameDialog.statusText',
    defaultMessage: 'Username available: @{normalized}',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepUserENSName';

const validationSchema = yup.object({
  username: yup
    .string()
    .required()
    .ensAddress(),
});

const getNormalizedDomainText = (domain: string) => {
  if (!domain) return null;
  try {
    const normalized = ensNormalize(domain);
    if (normalized === domain) return null;
    return normalized;
  } catch (e) {
    return null;
  }
};

class StepUserENSName extends Component<Props> {
  componentWillUnmount() {
    this.checkDomainTaken.unsubscribe();
  }

  checkDomainTaken = promiseListener.createAsyncFunction({
    start: ACTIONS.USERNAME_CHECK_AVAILABILITY,
    resolve: ACTIONS.USERNAME_CHECK_AVAILABILITY_SUCCESS,
    reject: ACTIONS.USERNAME_CHECK_AVAILABILITY_ERROR,
  });

  validateDomain = async (values: FormValues) => {
    try {
      await this.checkDomainTaken.asyncFunction(values);
    } catch (e) {
      const error = {
        username: MSG.errorDomainTaken,
      };
      // eslint doesn't allow for throwing object literals
      throw error;
    }
  };

  render() {
    const {
      formHelpers: { includeWizardValues },
      wizardForm,
      wizardValues,
      nextStep,
    } = this.props;
    const normalizedUsername = getNormalizedDomainText(wizardValues.username);
    return (
      <Form
        onSubmit={nextStep}
        validationSchema={validationSchema}
        validate={this.validateDomain}
        {...wizardForm}
      >
        {({ isValid, isSubmitting }) => (
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
                  status={normalizedUsername && MSG.statusText}
                  statusValues={{ normalized: normalizedUsername }}
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
        )}
      </Form>
    );
  }
}

StepUserENSName.displayName = displayName;

export default StepUserENSName;
