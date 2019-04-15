/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { WizardProps } from '~core/Wizard';

import { mergePayload } from '~utils/actions';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';

import { ACTIONS } from '~redux';

import styles from './StepConfirmAllInput.css';

import CardRow from './CreateColonyCardRow.jsx';

type FormValues = {
  colonyName: string,
  displayName: string,
  username: string,
  tokenSymbol: string,
  tokenName: string,
};

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  title: {
    id: 'CreateColony.StepConfirmAllInput.title',
    defaultMessage: `Does this look right?`,
  },
  subtitle: {
    id: 'CreateColony.StepConfirmAllInput.subtitle',
    defaultMessage: `Double check these are correct! We’ll package these
      up into separate transactions for you to deploy to the blockchain.`,
  },
  continue: {
    id: 'CreateColony.StepConfirmAllInput.continue',
    defaultMessage: `Continue`,
  },
  userName: {
    id: 'CreateColony.StepConfirmAllInput.userName',
    defaultMessage: `Your username`,
  },
  colonyName: {
    id: 'CreateColony.StepConfirmAllInput.colonyName',
    defaultMessage: `Your colony`,
  },
  tokenName: {
    id: 'CreateColony.StepConfirmAllInput.tokenName',
    defaultMessage: `Your colony's native token`,
  },
});

const options = [
  {
    title: MSG.userName,
    valueKey: 'username',
  },
  {
    title: MSG.colonyName,
    valueKey: 'colonyName',
  },
  {
    title: MSG.tokenName,
    valueKey: ['tokenSymbol', 'tokenName'],
  },
];

const StepConfirmAllInput = ({ nextStep, wizardValues }: Props) => {
  const {
    displayName,
    username,
    tokenSymbol,
    tokenName,
    colonyName,
  } = wizardValues;
  return (
    <ActionForm
      submit={ACTIONS.COLONY_CREATE}
      success={ACTIONS.COLONY_CREATE_SUCCESS}
      error={ACTIONS.COLONY_CREATE_ERROR}
      transform={mergePayload({
        username,
        displayName,
        colonyName,
        tokenName,
        tokenSymbol,
      })}
      onSuccess={() => nextStep(wizardValues)}
    >
      {({ isSubmitting, status }) => (
        <section className={styles.main}>
          <Heading
            appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
            text={MSG.title}
          />
          <p className={styles.paragraph}>
            <FormattedMessage {...MSG.subtitle} />
          </p>
          <div className={styles.finalContainer}>
            <CardRow cardOptions={options} values={wizardValues} />
          </div>
          <FormStatus status={status} />
          <div className={styles.buttons}>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              type="submit"
              text={MSG.continue}
              loading={isSubmitting}
            />
          </div>
        </section>
      )}
    </ActionForm>
  );
};

StepConfirmAllInput.displayName =
  'dashboard.CreateColonyWizard.StepConfirmAllInput';

export default StepConfirmAllInput;
