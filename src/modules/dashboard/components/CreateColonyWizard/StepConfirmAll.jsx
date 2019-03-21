/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { WizardProps } from '~core/Wizard';

import { mergePayload } from '~utils/actions';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { Form, FormStatus } from '~core/Fields';

import styles from './StepConfirmAll.css';

import CardRow from './CreateColonyCardRow.jsx';

type FormValues = {
  tokenAddress: string,
  colonyId: string,
  colonyAddress: string,
  colonyName: string,
  username: string,
  tokenSymbol: string,
  tokenName: string,
};

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  title: {
    id: 'CreateColony.StepConfirmAll.title',
    defaultMessage: `Does this look right?`,
  },
  subtitle: {
    id: 'CreateColony.StepConfirmAll.subtitle',
    defaultMessage: `Double check these are correct! We’ll package these
      up into separate transactions for you to deploy to the blockchain.`,
  },
  continue: {
    id: 'CreateColony.StepConfirmAll.continue',
    defaultMessage: `Continue`,
  },
  userName: {
    id: 'CreateColony.StepConfirmAll.userName',
    defaultMessage: `Your username`,
  },
  displayName: {
    id: 'CreateColony.StepCreateColony.displayName',
    defaultMessage: `Colony Name`,
  },
  tokenName: {
    id: 'CreateColony.StepConfirmAll.tokenName',
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


const StepConfirmAll = ({ nextStep, wizardValues }: Props) => (
  <Form onSubmit={() => nextStep(wizardValues)}>
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
  </Form>
);

StepConfirmAll.displayName = 'dashboard.CreateColonyWizard.StepConfirmAll';

export default StepConfirmAll;
