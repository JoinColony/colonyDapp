/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import styles from './StepUserENSName.css';

import { ActionForm, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
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
    id: 'dashboard.CreateColonyWizard.StepUserENSName.done',
    defaultMessage: 'Continue',
  },
  errorDomainTaken: {
    id: 'dashboard.CreateColonyWizard.StepUserENSName.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepUserENSName';

const validationSchema = yup.object({
  username: yup
    .string()
    .required()
    .ensAddress(),
});

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
    } = this.props;
    return (
      <ActionForm
        submit={ACTIONS.USERNAME_CREATE}
        error={ACTIONS.USERNAME_CREATE_ERROR}
        success={ACTIONS.USERNAME_CREATE_SUCCESS}
        validationSchema={validationSchema}
        validate={this.validateDomain}
        setPayload={includeWizardValues}
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
      </ActionForm>
    );
  }
}

StepUserENSName.displayName = displayName;

export default StepUserENSName;
