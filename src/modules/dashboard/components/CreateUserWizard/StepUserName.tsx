import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { useApolloClient } from '@apollo/client';
import { isConfusing } from 'unicode-confusables';

import ConfusableWarning from '~core/ConfusableWarning';
import { WizardProps } from '~core/Wizard';
import { ActionForm, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { ActionTypes } from '~redux/index';
import ENS from '~lib/ENS';
import {
  UserAddressDocument,
  UserAddressQuery,
  UserAddressQueryVariables,
  useLoggedInUser,
} from '~data/index';
import { DEFAULT_NETWORK_INFO } from '~constants';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import styles from './StepUserName.css';

interface FormValues {
  username: string;
}

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateUserWizard.StepUserName.heading',
    defaultMessage: 'Create your user account',
  },
  description: {
    id: 'dashboard.CreateUserWizard.StepUserName.description',
    defaultMessage: `To use Colony, you must create a username for your account.
    {br}Choose carefully, it is not possible to change your username later.`,
  },
  label: {
    id: 'dashboard.CreateUserWizard.StepUserName.label',
    defaultMessage: 'Your Unique Username',
  },
  continue: {
    id: 'dashboard.CreateUserWizard.StepUserName.continue',
    defaultMessage: 'Continue',
  },
  errorDomainTaken: {
    id: 'dashboard.CreateUserWizard.StepUserName.errorDomainTaken',
    defaultMessage: 'This Username is already taken',
  },
  errorDomainInvalid: {
    id: 'dashboard.CreateUserWizard.StepUserName.errorDomainInvalid',
    defaultMessage: 'Only characters a-z, 0-9, - and . are allowed',
  },
  statusText: {
    id: 'users.CreateUserWizard.StepUserName.statusText',
    defaultMessage: 'Actual Username: @{normalized}',
  },
});

const displayName = 'dashboard.CreateUserWizard.StepUserName';

const validationSchema = yup.object({
  username: yup.string().required().max(100).ensAddress(),
});

const StepUserName = ({ wizardValues, nextStep }: Props) => {
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
    <ActionForm
      initialValues={{}}
      onSuccess={() => nextStep(wizardValues)}
      submit={ActionTypes.USERNAME_CREATE}
      error={ActionTypes.USERNAME_CREATE_ERROR}
      success={ActionTypes.TRANSACTION_CREATED}
      validate={validateDomain}
      validationSchema={validationSchema}
    >
      {({ dirty, isValid, isSubmitting, values: { username } }) => {
        const normalized = ENS.normalizeAsText(username);
        return (
          <section className={styles.main}>
            <div>
              <Heading appearance={{ size: 'medium' }} text={MSG.heading} />
              <p className={styles.paragraph}>
                <FormattedMessage
                  {...MSG.description}
                  values={{ br: <br /> }}
                />
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
                  disabled={!isNetworkAllowed || isSubmitting}
                />
                {username && isConfusing(username) && <ConfusableWarning />}
                <div className={styles.buttons}>
                  <Button
                    appearance={{ theme: 'primary', size: 'large' }}
                    type="submit"
                    disabled={
                      !isNetworkAllowed || !isValid || !dirty || isSubmitting
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
    </ActionForm>
  );
};

StepUserName.displayName = displayName;

export default StepUserName;
