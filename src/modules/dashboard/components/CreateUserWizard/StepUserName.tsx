import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { WizardProps } from '~core/Wizard';
import { useAsyncFunction } from '~utils/hooks';
import { ActionForm, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Icon from '~core/Icon';
import Link from '~core/Link';
import { Tooltip } from '~core/Popover';
import { ActionTypes } from '~redux/index';
import ENS from '~lib/ENS';
import { DASHBOARD_ROUTE } from '~routes/index';
import styles from './StepUserName.css';

interface FormValues {
  username: string;
}

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateUserWizard.StepUserName.heading',
    defaultMessage: 'Welcome to Colony!',
  },
  descriptionOne: {
    id: 'dashboard.CreateUserWizard.StepUserName.descriptionOne',
    // eslint-disable-next-line max-len
    defaultMessage: `Let's get your account set up. Pick a username.`,
  },
  label: {
    id: 'dashboard.CreateUserWizard.StepUserName.label',
    defaultMessage: 'Your Unique Username',
  },
  continue: {
    id: 'dashboard.CreateUserWizard.StepUserName.continue',
    defaultMessage: 'Continue',
  },
  later: {
    id: 'dashboard.CreateUserWizard.StepUserName.later',
    defaultMessage: `I'll do it later`,
  },
  errorDomainTaken: {
    id: 'dashboard.CreateUserWizard.StepUserName.errorDomainTaken',
    defaultMessage: 'This Username is already taken',
  },
  errorDomainInvalid: {
    id: 'dashboard.CreateUserWizard.StepUserName.errorDomainInvalid',
    defaultMessage: 'Only characters a-z, 0-9, - and . are allowed',
  },
  tooltip: {
    id: 'dashboard.CreateUserWizard.StepUserName.tooltip',
    // eslint-disable-next-line max-len
    defaultMessage: `We use ENS to create a .joincolony.eth subdomain for your colony. You can use this to create a custom URL and invite people to join your colony.`,
  },
  statusText: {
    id: 'users.CreateUserWizard.StepUserName.statusText',
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
    submit: ActionTypes.USERNAME_CHECK_AVAILABILITY,
    success: ActionTypes.USERNAME_CHECK_AVAILABILITY_SUCCESS,
    error: ActionTypes.USERNAME_CHECK_AVAILABILITY_ERROR,
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
      initialValues={{}}
      onSuccess={() => nextStep(wizardValues)}
      submit={ActionTypes.USERNAME_CREATE}
      error={ActionTypes.USERNAME_CREATE_ERROR}
      success={ActionTypes.TRANSACTION_CREATED}
      validate={validateDomain}
      validationSchema={validationSchema}
    >
      {({ isValid, isSubmitting, values: { username } }) => {
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
                    <Link to={DASHBOARD_ROUTE}>
                      <FormattedMessage {...MSG.later} />
                    </Link>
                  </p>
                  <Button
                    appearance={{ theme: 'primary', size: 'large' }}
                    type="submit"
                    disabled={!isValid}
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
