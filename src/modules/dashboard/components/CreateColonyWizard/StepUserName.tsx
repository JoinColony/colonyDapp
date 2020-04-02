import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { useApolloClient } from '@apollo/react-hooks';

import { WizardProps } from '~core/Wizard';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ENS from '~lib/ENS';
import {
  UserAddressDocument,
  UserAddressQuery,
  UserAddressQueryVariables,
  useCreateUserMutation,
} from '~data/index';

import en from '../../../../i18n/en-validation.json';

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
    .ensAddress(en.string.username),
});

const StepUserName = ({ stepCompleted, wizardForm, nextStep }: Props) => {
  const apolloClient = useApolloClient();

  const checkUsernameTaken = useCallback(
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
        if (
          data &&
          data.userByName &&
          data.userByName.profile &&
          data.userByName.profile.walletAddress
        )
          return true;
        return false;
      } catch (e) {
        return false;
      }
    },
    [apolloClient],
  );

  const validateUsername = useCallback(
    async (values: FormValues) => {
      try {
        // Let's check whether this is even valid first
        validationSchema.validateSyncAt('username', values);
      } catch (caughtError) {
        // Just return. The actual validation will be done by the
        // validationSchema
        return {};
      }
      const taken = await checkUsernameTaken(values);
      if (taken) {
        const errors = {
          username: MSG.errorDomainTaken,
        };
        return errors;
      }
      return {};
    },
    [checkUsernameTaken],
  );

  const [createUsername] = useCreateUserMutation();
  const onSubmit = useCallback(
    async (values: FormValues) => {
      await createUsername({
        variables: {
          createUserInput: { username: values.username },
          loggedInUserInput: { username: values.username },
        },
      });
      return nextStep;
    },
    [createUsername, nextStep],
  );

  /*
   * @NOTE We don't need to redirect manually at this point (user created)
   * as the wizard tracks this itself, and skips this step if a username value
   * already exists
   */
  return (
    <Form
      initialValues={{}}
      onSubmit={onSubmit}
      validate={validateUsername}
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
                  status={
                    normalized && normalized === username
                      ? MSG.statusText
                      : undefined
                  }
                  statusValues={{
                    normalized,
                  }}
                  formattingOptions={{ lowercase: true }}
                  data-test="claimUsernameInput"
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
