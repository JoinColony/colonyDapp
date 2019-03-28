/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { normalize as ensNormalize } from 'eth-ens-namehash-ms';

import type { WizardProps } from '~core/Wizard';

import styles from './StepUserENSName.css';

import { mergePayload } from '~utils/actions';
import { useAsyncFunction } from '~utils/hooks';
import { ActionForm, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { ACTIONS } from '~redux';

type FormValues = {
  colonyName: string,
  ensName: string,
  username: string,
};

type Props = WizardProps<FormValues>;

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

const validationSchema = yup.object({
  colonyName: yup
    .string()
    .required()
    .ensAddress(),
});

const StepColonyENSName = ({ wizardValues, wizardForm }: Props) => {
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

  return (
    <ActionForm
      submit={ACTIONS.COLONY_CREATE_LABEL}
      error={ACTIONS.COLONY_CREATE_LABEL_ERROR}
      success={ACTIONS.COLONY_CREATE_LABEL_SUCCESS}
      validationSchema={validationSchema}
      validate={validateDomain}
      transform={mergePayload(wizardValues)}
      {...wizardForm}
    >
      {({ isValid, isSubmitting }) => (
        <section className={styles.main}>
          <div className={styles.title}>
            <Heading
              appearance={{ size: 'medium', weight: 'thin' }}
              text={MSG.heading}
            />
            <p className={styles.paragraph}>
              <FormattedMessage
                {...MSG.descriptionOne}
                values={{
                  boldText: (
                    <FormattedMessage
                      tagName="strong"
                      {...MSG.descriptionBoldText}
                    />
                  ),
                }}
              />
            </p>
            <p className={styles.paragraph}>
              <FormattedMessage {...MSG.descriptionTwo} />
            </p>
            <div className={styles.nameForm}>
              <Input
                appearance={{ theme: 'fat' }}
                name="colonyName"
                label={MSG.label}
              />
              <div className={styles.buttons}>
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  type="submit"
                  disabled={!isValid}
                  loading={isSubmitting}
                  text={MSG.done}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </ActionForm>
  );
};

StepColonyENSName.displayName = displayName;

export default StepColonyENSName;
