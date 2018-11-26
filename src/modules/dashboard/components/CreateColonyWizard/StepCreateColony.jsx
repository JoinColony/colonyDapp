/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { WizardProps } from '~core/Wizard';

import Heading from '~core/Heading';
import Button from '~core/Button';
import { ActionForm } from '~core/Fields';

import styles from './StepCreateColony.css';

import CreatingColony from './CreatingColony.jsx';
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
    defaultMessage: 'Could not create Colony',
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
    setPayload={(action: *) => ({
      ...action,
      payload: { tokenAddress: wizardValues.tokenAddress },
    })}
    // eslint-disable-next-line no-unused-vars
    onError={(error: *, bag: *) => {
      // TODO later: show error feedback
      console.warn(error); // eslint-disable-line no-console
    }}
    {...wizardForm}
  >
    {({ isSubmitting }) =>
      isSubmitting ? (
        <CreatingColony />
      ) : (
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
          <div className={styles.buttons}>
            <Button
              appearance={{ theme: 'secondary' }}
              text={MSG.back}
              onClick={() => previousStep()}
            />
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              style={{ width: styles.wideButton }}
              text={MSG.confirm}
              type="submit"
            />
          </div>
        </section>
      )
    }
  </ActionForm>
);

StepCreateColony.displayName = 'dashboard.CreateColonyWizard.StepCreateColony';

export default StepCreateColony;
