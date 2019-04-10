/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { compose } from 'recompose';

import type { WizardProps } from '~core/Wizard';
import type { UserType } from '~immutable';

import styles from './StepUserENSName.css';

import { useAsyncFunction } from '~utils/hooks';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { ACTIONS } from '~redux';

import { withCurrentUser } from '../../../users/hocs';
import { withImmutablePropsToJS } from '~utils/hoc';

import { getNormalizedDomainText } from '~utils/strings';

type FormValues = {
  colonyName: string,
  ensName: string,
  username: string,
};

type Props = WizardProps<FormValues> & {
  currentUser: UserType,
};

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepColonyENSName.heading',
    defaultMessage: 'Welcome @{username}, let’s begin creating your colony.',
  },
  descriptionOne: {
    id: 'dashboard.CreateColonyWizard.StepColonyENSName.descriptionOne',
    defaultMessage:
      // eslint-disable-next-line max-len
      'First thing is choosing a name. What would you like to name your colony?',
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepColonyENSName.label',
    defaultMessage: 'Colony Unique URL',
  },
  labelDisplay: {
    id: 'dashboard.CreateColonyWizard.StepColonyENSName.labelDisplay',
    defaultMessage: 'Colony Name',
  },
  continue: {
    id: 'dashboard.CreateColonyWizard.StepColonyENSName.Continue',
    defaultMessage: 'Continue',
  },
  errorDomainTaken: {
    id: 'dashboard.CreateColonyWizard.StepColonyENSName.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
  statusText: {
    id: 'users.ENSNameDialog.statusText',
    defaultMessage: 'URL available: @{normalized}',
  },
  tooltip: {
    id: 'users.ENSNameDialog.tooltip',
    defaultMessage: `We use ENS to create a .joincolony.eth subdomain for your
      colony. This will also allow us to create a custom URL for inviting people
      to your colony.`,
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepColonyENSName';

const validationSchema = yup.object({
  colonyName: yup
    .string()
    .required()
    .ensAddress(),
});

const StepColonyENSName = ({
  wizardValues,
  wizardForm,
  nextStep,
  currentUser: {
    profile: { username },
  },
}: Props) => {
  const checkDomainTaken = useAsyncFunction({
    submit: ACTIONS.COLONY_DOMAIN_VALIDATE,
    success: ACTIONS.COLONY_DOMAIN_VALIDATE_SUCCESS,
    error: ACTIONS.COLONY_DOMAIN_VALIDATE_ERROR,
  });

  const validateDomain = useCallback(
    async (values: FormValues) => {
      try {
        await checkDomainTaken(values);
      } catch (e) {
        const error = {
          ensName: MSG.errorDomainTaken,
        };
        // eslint doesn't allow for throwing object literals
        throw error;
      }
    },
    // This is unnecessary because the ref is never changing. The linter isn't smart enough to know that though
    [checkDomainTaken],
  );
  const normalizedUsername = getNormalizedDomainText(wizardValues.username);

  return (
    <Form
      onSubmit={nextStep}
      validationSchema={validationSchema}
      validate={validateDomain}
      {...wizardForm}
    >
      {({ isValid, isSubmitting }) => (
        <section className={styles.main}>
          <div className={styles.title}>
            <Heading
              appearance={{ size: 'medium', weight: 'medium' }}
              text={MSG.heading}
              textValues={{
                username: wizardValues.username || username,
              }}
            />
            <p className={styles.paragraph}>
              <FormattedMessage {...MSG.descriptionOne} />
            </p>
            <div className={styles.nameForm}>
              <Input
                appearance={{ theme: 'fat' }}
                name="colonyName"
                label={MSG.labelDisplay}
              />
              <Input
                appearance={{ theme: 'fat' }}
                name="ensName"
                extensionString=".colony.joincolony.eth"
                label={MSG.label}
                status={normalizedUsername && MSG.statusText}
                statusValues={{ normalized: normalizedUsername }}
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
};

StepColonyENSName.displayName = displayName;

export default compose(
  withCurrentUser,
  withImmutablePropsToJS,
)(StepColonyENSName);
