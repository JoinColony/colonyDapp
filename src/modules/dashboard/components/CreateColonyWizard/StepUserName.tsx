import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { useApolloClient } from '@apollo/client';
import { isConfusing } from 'unicode-confusables';

import ConfusableWarning from '~core/ConfusableWarning';
import { WizardProps } from '~core/Wizard';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ENS from '~lib/ENS';
import {
  UserAddressDocument,
  UserAddressQuery,
  UserAddressQueryVariables,
  useLoggedInUser,
} from '~data/index';
import { DEFAULT_NETWORK_INFO, DEFAULT_NETWORK_TOKEN } from '~constants';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import styles from './StepUserName.css';

type FormValues = {
  username: string;
};

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepUserName.heading',
    defaultMessage: 'Create your user account',
  },
  descriptionOne: {
    id: 'dashboard.CreateColonyWizard.StepUserName.descriptionOne',
    defaultMessage: `Choose carefully, it is not possible to change your username later.`,
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
    defaultMessage: `Got {tokenSymbol}? You'll need some at the end
      to cover {networkName}'s transaction fees.`,
  },
  errorDomainTaken: {
    id: 'dashboard.CreateColonyWizard.StepUserName.errorDomainTaken',
    defaultMessage: 'This Username is already taken',
  },
  errorDomainInvalid: {
    id: 'dashboard.CreateColonyWizard.StepUserName.errorDomainInvalid',
    defaultMessage: 'Only characters a-z, 0-9, - and . are allowed',
  },
  statusText: {
    id: 'users.CreateColonyWizard.StepUserName.statusText',
    defaultMessage: 'Actual Username: @{normalized}',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepUserName';

const validationSchema = yup.object({
  username: yup.string().required().max(100).ensAddress(),
});

const StepUserName = ({ stepCompleted, wizardForm, nextStep }: Props) => {
  const apolloClient = useApolloClient();
  const { networkId } = useLoggedInUser();

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

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

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
                  // eslint-disable-next-line max-len
                  extensionString={` .user.${DEFAULT_NETWORK_INFO.displayENSDomain}`}
                  status={normalized !== username ? MSG.statusText : undefined}
                  statusValues={{
                    normalized,
                  }}
                  formattingOptions={{ lowercase: true, blocks: [100] }}
                  data-test="claimUsernameInput"
                  disabled={!isNetworkAllowed || isSubmitting}
                />
                {username && isConfusing(username) && <ConfusableWarning />}
                <div className={styles.buttons}>
                  <p className={styles.reminder}>
                    <FormattedMessage
                      {...MSG.gotETH}
                      values={{
                        tokenSymbol: DEFAULT_NETWORK_TOKEN.symbol,
                        networkName: DEFAULT_NETWORK_INFO.name,
                      }}
                    />
                  </p>
                  <Button
                    appearance={{ theme: 'primary', size: 'large' }}
                    type="submit"
                    disabled={
                      !isNetworkAllowed ||
                      !isValid ||
                      (!dirty && !stepCompleted) ||
                      isSubmitting
                    }
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
