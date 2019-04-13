/* @flow */

import type { FormikBag } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';

import type { WizardProps } from '~core/Wizard';

import { mergePayload } from '~utils/actions';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { ACTIONS } from '~redux';

import styles from './StepCreateColony.css';

import CardRow from './CreateColonyCardRow.jsx';

type FormValues = {
  tokenAddress: string,
  colonyId: string,
  colonyAddress: string,
};

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  errorCreateColony: {
    id: 'error.colony.createColony',
    defaultMessage:
      "Could not create Colony. Most likely that's not your fault",
  },
  title: {
    id: 'CreateColony.StepCreateColony.title',
    defaultMessage: `Almost there! Confirm your details`,
  },
  subtitle: {
    id: 'CreateColony.StepCreateColony.subtitle',
    defaultMessage: `and create your new Colony.`,
  },
  confirm: {
    id: 'CreateColony.StepCreateColony.confirmButton',
    defaultMessage: `Create Colony`,
  },
  back: {
    id: 'CreateColony.StepCreateColony.backButton',
    defaultMessage: `Back`,
  },
  displayName: {
    id: 'CreateColony.StepCreateColony.displayName',
    defaultMessage: `Colony Name`,
  },
  tokenName: {
    id: 'CreateColony.StepCreateColony.tokenName',
    defaultMessage: `Token Name`,
  },
  tokenSymbol: {
    id: 'CreateColony.StepCreateColony.tokenSymbol',
    defaultMessage: `Token Symbol`,
  },
});

const options = [
  {
    title: MSG.displayName,
    valueKey: 'displayName',
  },
  {
    title: MSG.tokenName,
    valueKey: 'tokenName',
  },
  {
    title: MSG.tokenSymbol,
    valueKey: 'tokenSymbol',
  },
];

const StepCreateColony = ({ nextStep, wizardForm, wizardValues }: Props) => (
  <ActionForm
    submit={ACTIONS.COLONY_CREATE}
    error={ACTIONS.COLONY_CREATE_ERROR}
    success={ACTIONS.COLONY_CREATE_SUCCESS}
    transform={mergePayload({ tokenAddress: wizardValues.tokenAddress })}
    onSuccess={({ eventData: { colonyId, colonyAddress } }) =>
      nextStep({
        ...wizardValues,
        colonyId,
        colonyAddress,
      })
    }
    onError={(_: Object, { setStatus }: FormikBag<Object, FormValues>) =>
      setStatus({ error: MSG.errorCreateColony })
    }
    {...wizardForm}
  >
    {({ isSubmitting, status }) => (
      <section className={styles.content}>
        <div className={styles.finalContainer}>
          <Heading
            appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
            text={MSG.title}
          />
          <Heading
            appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
            text={MSG.subtitle}
          />
          <CardRow cardOptions={options} values={wizardValues} />
        </div>
        <FormStatus status={status} />
        <div className={styles.buttons}>
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            type="submit"
            text={MSG.confirm}
            loading={isSubmitting}
          />
        </div>
      </section>
    )}
  </ActionForm>
);

StepCreateColony.displayName = 'dashboard.CreateColonyWizard.StepCreateColony';

export default StepCreateColony;
