/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';
import type { UserType } from '~immutable';

import styles from './StepColonyName.css';

import { useAsyncFunction, useSelector } from '~utils/hooks';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { ACTIONS } from '~redux';

import { getNormalizedDomainText } from '~utils/strings';

import { currentUserSelector } from '../../../users/selectors';

type FormValues = {
  displayName: string,
  colonyName: string,
  username: string,
};

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.heading',
    defaultMessage: "Welcome @{username}, let's create your colony.",
  },
  descriptionOne: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.descriptionOne',
    defaultMessage:
      // eslint-disable-next-line max-len
      'First thing is choosing a name. What would you like to name your colony?',
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.label',
    defaultMessage: 'Colony Unique URL',
  },
  labelDisplay: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.labelDisplay',
    defaultMessage: 'Colony Name',
  },
  continue: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.Continue',
    defaultMessage: 'Continue',
  },
  errorDomainTaken: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
  errorDomainInvalid: {
    id: 'dashboard.CreateColonyWizard.StepColonyENSName.errorDomainInvalid',
    defaultMessage: 'Only characters a-z, 0-9, - and . are allowed',
  },
  statusText: {
    id: 'users.CreateColonyWizard.StepColonyName.statusText',
    defaultMessage: 'Actual Colony Name: {normalized}',
  },
  tooltip: {
    id: 'users.CreateColonyWizard.StepColonyName.tooltip',
    defaultMessage:
      // eslint-disable-next-line max-len
      'We use ENS to create a .joincolony.eth subdomain for your colony. You can use this to create a custom URL and invite people to join your colony.',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepColonyName';

const validationSchema = yup.object({
  colonyName: yup
    .string()
    .required()
    .ensAddress(),
  displayName: yup.string().required(),
});

const StepColonyName = ({ wizardForm, nextStep, wizardValues }: Props) => {
  const checkDomainTaken = useAsyncFunction({
    submit: ACTIONS.COLONY_NAME_CHECK_AVAILABILITY,
    success: ACTIONS.COLONY_NAME_CHECK_AVAILABILITY_SUCCESS,
    error: ACTIONS.COLONY_NAME_CHECK_AVAILABILITY_ERROR,
  });

  const currentUser: UserType = useSelector(currentUserSelector);
  const {
    profile: { username },
  } = currentUser;

  const validateDomain = useCallback(
    async (values: FormValues) => {
      try {
        // Let's check whether this is even valid first
        validationSchema.validateSyncAt('colonyName', values);
      } catch (caughtError) {
        // Just return. The actual validation will be done by the
        // validationSchema
        return;
      }
      try {
        await checkDomainTaken(values);
      } catch (e) {
        const error = {
          colonyName: MSG.errorDomainTaken,
        };
        throw error;
      }
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
      {({ isValid, isSubmitting, values: { colonyName } }) => {
        const normalized = getNormalizedDomainText(colonyName);
        return (
          <section className={styles.main}>
            <div className={styles.title}>
              <Heading
                appearance={{ size: 'medium', weight: 'medium' }}
                text={MSG.heading}
                textValues={{
                  username: getNormalizedDomainText(
                    username || wizardValues.username,
                  ),
                }}
              />
              <p className={styles.paragraph}>
                <FormattedMessage {...MSG.descriptionOne} />
              </p>
              <div className={styles.nameForm}>
                <Input
                  appearance={{ theme: 'fat' }}
                  name="displayName"
                  label={MSG.labelDisplay}
                />
                <Input
                  appearance={{ theme: 'fat' }}
                  name="colonyName"
                  extensionString=".colony.joincolony.eth"
                  label={MSG.label}
                  status={normalized !== colonyName ? MSG.statusText : null}
                  statusValues={{ normalized }}
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
        );
      }}
    </Form>
  );
};

StepColonyName.displayName = displayName;

export default StepColonyName;
