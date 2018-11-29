/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';
import type { Action } from '~types/index';

import styles from './StepCreateENSName.css';

import { ActionForm, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';

import promiseListener from '../../../../createPromiseListener';

import {
  COLONY_CREATE_LABEL,
  COLONY_CREATE_LABEL_ERROR,
  COLONY_CREATE_LABEL_SUCCESS,
  COLONY_DOMAIN_VALIDATE,
  COLONY_DOMAIN_VALIDATE_SUCCESS,
  COLONY_DOMAIN_VALIDATE_ERROR,
} from '../../actionTypes';

type FormValues = {
  colonyLabel: string,
  colonyId: string,
  colonyAddress: string,
};

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepCreateENSName.heading',
    defaultMessage: 'Last step: create a unique name for your Colony',
  },
  descriptionOne: {
    id: 'dashboard.CreateColonyWizard.StepCreateENSName.descriptionOne',
    defaultMessage:
      // eslint-disable-next-line max-len
      "Here's something cool about Colony: {boldText} You own it, you control it.",
  },
  descriptionBoldText: {
    id: 'dashboard.CreateColonyWizard.StepCreateENSName.descriptionBoldText',
    defaultMessage:
      // eslint-disable-next-line max-len
      "we are a fully decentralized application and do not have a central store of yours or anyone's data.",
  },
  descriptionTwo: {
    id: 'dashboard.CreateColonyWizard.StepCreateENSName.descriptionTwo',
    defaultMessage:
      // eslint-disable-next-line max-len
      'To setup your data storage, we need you to create a unique name for your colony. This allows a mapping between the data stored on the blockchain, on IPFS, and your colony.',
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepCreateENSName.label',
    defaultMessage: 'Your unique colony domain name',
  },
  done: {
    id: 'dashboard.CreateColonyWizard.StepCreateENSName.done',
    defaultMessage: 'Done',
  },
  errorDomainTaken: {
    id: 'users.CreateUsernameDialog.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepCreateENSName';

const validationSchema = yup.object({
  ensName: yup
    .string()
    .required()
    .ensAddress(),
});

class StepCreateENSName extends Component<Props> {
  componentWillUnmount() {
    this.checkDomainTaken.unsubscribe();
  }

  checkDomainTaken = promiseListener.createAsyncFunction({
    start: COLONY_DOMAIN_VALIDATE,
    resolve: COLONY_DOMAIN_VALIDATE_SUCCESS,
    reject: COLONY_DOMAIN_VALIDATE_ERROR,
  });

  validateDomain = async (values: FormValues) => {
    try {
      await this.checkDomainTaken.asyncFunction(values);
    } catch (e) {
      const error = {
        ensName: MSG.errorDomainTaken,
      };
      // eslint doesn't allow for throwing object literals
      throw error;
    }
  };

  render() {
    const { wizardForm, wizardValues } = this.props;
    return (
      <ActionForm
        submit={COLONY_CREATE_LABEL}
        error={COLONY_CREATE_LABEL_ERROR}
        success={COLONY_CREATE_LABEL_SUCCESS}
        setPayload={(action: Action, payload: Object) => ({
          ...action,
          payload: { ...wizardValues, ...payload },
        })}
        validationSchema={validationSchema}
        validate={this.validateDomain}
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
                  name="ensName"
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
  }
}

StepCreateENSName.displayName = displayName;

export default StepCreateENSName;
