/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import type { ActionSubmit } from '~core/Wizard';

import Heading from '~core/Heading';
import Button from '~core/Button';

import styles from './StepCreateColony.css';

import CreatingColony from './CreatingColony.jsx';
import CardRow from './CreateColonyCardRow.jsx';

import {
  CREATE_COLONY,
  CREATE_COLONY_ERROR,
  CREATE_COLONY_SUCCESS,
} from '../../actionTypes';

type FormValues = {
  tokenAddress: string,
  tokenCreated: boolean,
};

type Props = {
  nextStep: () => void,
  previousStep: () => void,
  createColonyAction: (tokenAddress: string) => void,
} & FormikProps<FormValues>;

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

const StepCreateColony = ({ isSubmitting, previousStep, values }: Props) => (
  <Fragment>
    {isSubmitting ? (
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
          <CardRow cardOptions={options} values={values} />
        </div>
        <div className={styles.buttons}>
          <Button
            appearance={{ theme: 'secondary' }}
            type="cancel"
            text={MSG.back}
            onClick={previousStep}
          />
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            style={{ width: styles.wideButton }}
            text={MSG.confirm}
            type="submit"
          />
        </div>
      </section>
    )}
  </Fragment>
);

StepCreateColony.displayName = 'dashboard.CreateColonyWizard.StepCreateColony';

export const onSubmit: ActionSubmit<{ tokenAddress: string }> = {
  submit: CREATE_COLONY,
  error: CREATE_COLONY_ERROR,
  success: CREATE_COLONY_SUCCESS,
  setPayload(action: *, { tokenAddress }: *) {
    return { ...action, payload: { params: { tokenAddress } } };
  },
  // eslint-disable-next-line no-unused-vars
  onError(error: *, bag: *) {
    // TODO later: show error feedback
    console.warn(error); // eslint-disable-line no-console
  },
};

export const Step = StepCreateColony;
