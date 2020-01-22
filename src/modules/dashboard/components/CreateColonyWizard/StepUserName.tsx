import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { useApolloClient } from '@apollo/react-hooks';

import { WizardProps } from '~core/Wizard';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import ENS from '~lib/ENS';
import {
  UserAddressDocument,
  UserAddressQuery,
  UserAddressQueryVariables,
} from '~data/index';

import styles from './StepUserName.css';

type FormValues = {
  username: string;
};

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepUserName.heading',
    defaultMessage: 'Welcome to Colony!',
  },
  descriptionOne: {
    id: 'dashboard.CreateColonyWizard.StepUserName.descriptionOne',
    // eslint-disable-next-line max-len
    defaultMessage: `Let's get your account set up. Pick a username.`,
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepUserName.label',
    defaultMessage: 'Your Unique Username',
  },
  continue: {
    id: 'dashboard.CreateColonyWizard.StepUserName.continue',
    defaultMessage: 'Continue',
  },
  gotETH: {
    id: 'dashboard.CreateColonyWizard.StepUserName.gotETH',
    defaultMessage: `Got ETH? You'll need some at the end
      to cover Ethereum's transaction fees.`,
  },
  errorDomainTaken: {
    id: 'dashboard.CreateColonyWizard.StepUserName.errorDomainTaken',
    defaultMessage: 'This Username is already taken',
  },
  errorDomainInvalid: {
    id: 'dashboard.CreateColonyWizard.StepUserName.errorDomainInvalid',
    defaultMessage: 'Only characters a-z, 0-9, - and . are allowed',
  },
  tooltip: {
    id: 'dashboard.CreateColonyWizard.StepUserName.tooltip',
    // eslint-disable-next-line max-len
    defaultMessage: `We use ENS to create a .joincolony.eth subdomain for your colony. You can use this to create a custom URL and invite people to join your colony.`,
  },
  statusText: {
    id: 'users.CreateColonyWizard.StepUserName.statusText',
    defaultMessage: 'Actual Username: @{normalized}',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepUserName';

const validationSchema = yup.object({
  username: yup
    .string()
    .required()
    .ensAddress(),
});

const StepUserName = ({ stepCompleted, wizardForm, nextStep }: Props) => {
  const apolloClient = useApolloClient();

  const checkDomainTaken = useCallback(
    async (values: FormValues) => {
      try {
        const { data } = await apolloClient.query<
          UserAddressQuery,
          UserAddressQueryVariables
        >({
          query: UserAddressDocument,
          variables: {
            name: values.username,
          },
        });
        if (data && data.userAddress) return true;
        return false;
      } catch (e) {
        return false;
      }
    },
    [apolloClient],
  );

  const validateDomain = useCallback(
    async (values: FormValues) => {
      try {
        // Let's check whether this is even valid first
        validationSchema.validateSyncAt('username', values);
      } catch (caughtError) {
        // Just return. The actual validation will be done by the
        // validationSchema
        return {};
      }
      const taken = await checkDomainTaken(values);
      if (taken) {
        const errors = {
          username: MSG.errorDomainTaken,
        };
        return errors;
      }
      return {};
    },
    [checkDomainTaken],
  );
  return (
    <Form
      onSubmit={nextStep}
      validate={validateDomain}
      validationSchema={validationSchema}
      {...wizardForm}
    >
      {({ dirty, isValid, isSubmitting, values: { username } }) => {
        const normalized = ENS.normalizeAsText(username);
        return (
          <section className={styles.main}>
            <div>
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
                  status={normalized !== username ? MSG.statusText : null}
                  statusValues={{
                    normalized,
                  }}
                  formattingOptions={{ lowercase: true }}
                  data-test="claimUsernameInput"
                  extra={
                    <Tooltip
                      placement="right"
                      content={
                        <span>
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
                    disabled={!isValid || (!dirty && !stepCompleted)}
                    loading={isSubmitting}
                    text={MSG.continue}
                    data-test="claimUsernameConfirm"
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

StepUserName.displayName = displayName;
StepUserName.stepName = 'StepUserName';

export default StepUserName;
