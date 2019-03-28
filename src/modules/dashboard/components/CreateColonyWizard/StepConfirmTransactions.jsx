/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { WizardProps } from '~core/Wizard';
import type { TransactionGroup } from '../../../users/components/GasStation/transactionGroup';

import styles from './StepConfirmTransactions.css';

import { groupedTransactions } from '../../../core/selectors';

import Heading from '~core/Heading';
import GasStationContent from '../../../users/components/GasStation';
import { useSelector } from '~utils/hooks';

type FormValues = {};
type Props = WizardProps<FormValues>;

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

const displayName = 'dashboard.CreateColonyWizard.StepConfirmTransactions';

// fixme TODO: when last transaction is successful redirect
const StepConfirmTransactions = () => {
  const transactionGroups = useSelector(groupedTransactions);

  return (
    <section className={styles.main}>
      <Heading
        appearance={{ size: 'medium', weight: 'medium' }}
        text={MSG.heading}
      />
      <div className={styles.container}>
        {transactionGroups && transactionGroups[0] && (
          <GasStationContent hideHeader transactionGroups={transactionGroups} />
        )}
      </div>
    </section>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
