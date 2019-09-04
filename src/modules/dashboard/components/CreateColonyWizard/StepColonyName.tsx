import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { WizardProps } from '~core/Wizard';
import { UserType } from '~immutable/index';
import { useAsyncFunction, useSelector } from '~utils/hooks';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { ActionTypes } from '~redux/index';
import { multiLineTextEllipsis } from '~utils/strings';
import ENS from '~lib/ENS';
import { currentUserSelector } from '../../../users/selectors';
import styles from './StepColonyName.css';

interface FormValues {
  displayName: string;
  colonyName: string;
  username: string;
}

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
    // @ts-ignore
    .ensAddress(),
  displayName: yup.string().required(),
});

const StepColonyName = ({ wizardForm, nextStep, wizardValues }: Props) => {
  const checkDomainTaken = useAsyncFunction({
    submit: ActionTypes.COLONY_NAME_CHECK_AVAILABILITY,
    success: ActionTypes.COLONY_NAME_CHECK_AVAILABILITY_SUCCESS,
    error: ActionTypes.COLONY_NAME_CHECK_AVAILABILITY_ERROR,
  });

  const currentUser: UserType = useSelector(currentUserSelector);
  const {
    profile: { username },
  } = currentUser;

  const [currentENSName, setCurrentENSName] = useState();

  const validateDomain = useCallback(
    async (values: FormValues) => {
      if (values && currentENSName === values.colonyName) {
        return;
      }
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
        setCurrentENSName(values.colonyName);
      } catch (e) {
        const error = {
          colonyName: MSG.errorDomainTaken,
        };
        throw error;
      }
    },
    [checkDomainTaken, currentENSName, setCurrentENSName],
  );

  return (
    <Form
      onSubmit={nextStep}
      validate={validateDomain}
      validationSchema={validationSchema}
      {...wizardForm}
    >
      {({ isValid, isSubmitting, values: { colonyName } }) => {
        const normalized = ENS.normalizeAsText(colonyName);
        return (
          <section className={styles.main}>
            <Heading appearance={{ size: 'medium', weight: 'medium' }}>
              <FormattedMessage
                {...MSG.heading}
                values={{
                  /*
                   * @NOTE We need to use a JS string truncate here, rather then CSS,
                   * since we're dealing with a string that needs to be truncated,
                   * inside a sentence that does not
                   */
                  username: (
                    <span
                      /*
                       * @NOTE Needed so the user can get the full username on hover
                       * (But still, if it's too long, the browser will trucate it)
                       */
                      title={ENS.normalizeAsText(
                        username || wizardValues.username,
                      )}
                    >
                      {multiLineTextEllipsis(
                        ENS.normalizeAsText(username || wizardValues.username),
                        38,
                      )}
                    </span>
                  ),
                }}
              />
            </Heading>
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
                formattingOptions={{ lowercase: true }}
                statusValues={{ normalized }}
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
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  type="submit"
                  disabled={!isValid}
                  loading={isSubmitting}
                  text={MSG.continue}
                />
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
