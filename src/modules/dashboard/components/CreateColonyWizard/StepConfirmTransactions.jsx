/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { Redirect } from 'react-router';

import type { WizardProps } from '~core/Wizard';

import styles from './StepConfirmTransactions.css';

import { groupedTransactions } from '../../../core/selectors';

import Heading from '~core/Heading';
import GasStationContent from '../../../users/components/GasStation/GasStationContent';
import { useSelector } from '~utils/hooks';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepConfirmTransactions.heading',
    defaultMessage: `Complete these transactions to deploy
      your colony to the blockchain.`,
  },
  descriptionOne: {
    id: 'dashboard.CreateColonyWizard.StepConfirmTransactions.descriptionOne',
    defaultMessage:
      // eslint-disable-next-line max-len
      "Here's something cool about Colony: {boldText} You own it, you control it.",
  },
  descriptionBoldText: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.CreateColonyWizard.StepConfirmTransactions.descriptionBoldText',
    defaultMessage:
      // eslint-disable-next-line max-len
      "we are a fully decentralized application and do not have a central store of yours or anyone's data.",
  },
  descriptionTwo: {
    id: 'dashboard.CreateColonyWizard.StepConfirmTransactions.descriptionTwo',
    defaultMessage:
      // eslint-disable-next-line max-len
      'To setup your data storage, we need you to create a unique name for your colony. This allows a mapping between the data stored on the blockchain, on IPFS, and your colony.',
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepConfirmTransactions.label',
    defaultMessage: 'Your unique colony domain name',
  },
  continue: {
    id: 'dashboard.CreateColonyWizard.StepConfirmTransactions.continue',
    defaultMessage: 'Continue',
  },
  callToAction: {
    id: 'dashboard.CreateColonyWizard.StepConfirmTransactions.callToAction',
    defaultMessage: 'Click confirm to sign each transaction',
  },
  errorDomainTaken: {
    id: 'dashboard.CreateColonyWizard.StepConfirmTransactions.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
});

type FormValues = { ensName: string };

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepConfirmTransactions';

/* check if all transactions are ready so redirect can happen */
const checkIfTransactionsSucceeded = transactionGroup => {
  const succeededTransactionIdx = transactionGroup.findIndex(
    transaction => transaction.status !== 'succeeded',
  );
  if (succeededTransactionIdx > -1) return false;
  return true;
};

const StepConfirmTransactions = ({ wizardValues: { ensName } }: Props) => {
  const transactionGroups = useSelector(groupedTransactions);
  if (checkIfTransactionsSucceeded(transactionGroups)) {
    return <Redirect to={`/colony/${ensName}`} />;
  }

  return (
    <section className={styles.main}>
      <Heading
        appearance={{ size: 'medium', weight: 'medium' }}
        text={MSG.heading}
      />
      <div className={styles.container}>
        {transactionGroups && transactionGroups[0] && (
          <GasStationContent
            hideHeader
            skipToDetails
            transactionGroups={transactionGroups}
          />
        )}
      </div>
    </section>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
