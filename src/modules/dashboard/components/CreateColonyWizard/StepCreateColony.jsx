/* @flow */

import type { FormikBag } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';

import type { WizardProps } from '~core/Wizard';
import type { Action } from '~types/index';

import Heading from '~core/Heading';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';

import styles from './StepCreateColony.css';

import CardRow from './CreateColonyCardRow.jsx';

import {
  COLONY_CREATE,
  COLONY_CREATE_ERROR,
  COLONY_CREATE_SUCCESS,
} from '../../actionTypes';

type FormValues = {
  tokenAddress: string,
  tokenCreated: boolean,
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
  colonyName: {
    id: 'CreateColony.StepCreateColony.colonyName',
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
    title: MSG.colonyName,
    valueKey: 'colonyName',
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

const StepCreateColony = ({
  previousStep,
  wizardForm,
  wizardValues,
}: Props) => (
  <ActionForm
    submit={COLONY_CREATE}
    error={COLONY_CREATE_ERROR}
    success={COLONY_CREATE_SUCCESS}
    setPayload={(action: Action) => ({
      ...action,
      payload: { tokenAddress: wizardValues.tokenAddress },
    })}
    onError={(_: Object, { setStatus }: FormikBag<Object, FormValues>) =>
      setStatus({ error: MSG.errorCreateColony })
    }
    {...wizardForm}
  >
    {({ isSubmitting, status, values }) => (
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
          <CardRow cardOptions={options} values={values} />
        </div>
        <FormStatus status={status} />
        <div className={styles.buttons}>
          <Button
            appearance={{ theme: 'secondary', size: 'large' }}
            type="cancel"
            text={MSG.back}
            onClick={() => previousStep(values)}
            disabled={isSubmitting}
          />
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
