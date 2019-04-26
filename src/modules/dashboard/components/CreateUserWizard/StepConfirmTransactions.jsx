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

import {
  getGroupStatus,
  findTransactionGroupByKey,
  getGroupKey,
} from '../../../users/components/GasStation/transactionGroup';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransactions.heading',
    defaultMessage: `Complete these transactions to deploy
      your colony to the blockchain.`,
  },
  descriptionOne: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransactions.descriptionOne',
    defaultMessage:
      // eslint-disable-next-line max-len
      "Here's something cool about Colony: {boldText} You own it, you control it.",
  },
  descriptionBoldText: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.CreateUserWizard.StepConfirmTransactions.descriptionBoldText',
    defaultMessage:
      // eslint-disable-next-line max-len
      "we are a fully decentralized application and do not have a central store of yours or anyone's data.",
  },
  descriptionTwo: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransactions.descriptionTwo',
    defaultMessage:
      // eslint-disable-next-line max-len
      'To setup your data storage, we need you to create a unique name for your colony. This allows a mapping between the data stored on the blockchain, on IPFS, and your colony.',
  },
  label: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransactions.label',
    defaultMessage: 'Your unique colony domain name',
  },
  continue: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransactions.continue',
    defaultMessage: 'Continue',
  },
  callToAction: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransactions.callToAction',
    defaultMessage: 'Click confirm to sign each transaction',
  },
  errorDomainTaken: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransactions.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
});

type FormValues = { colonyName: string };

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateUserWizard.StepConfirmTransactions';

const StepConfirmTransactions = ({ wizardValues: { colonyName } }: Props) => {
  const transactionGroups = useSelector(groupedTransactions);
  if (
    getGroupStatus(transactionGroups[0]) === 'succeeded' &&
    getGroupKey(transactionGroups[0]) === 'group.transaction.batch.createColony'
  ) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  const colonyTransaction = findTransactionGroupByKey(
    transactionGroups,
    'group.transaction.batch.createColony',
  );

  return (
    <section className={styles.main}>
      <Heading
        appearance={{ size: 'medium', weight: 'medium' }}
        text={MSG.heading}
      />
      <div className={styles.container}>
        {colonyTransaction && (
          <GasStationContent
            appearance={{ interactive: false }}
            transactionGroups={[colonyTransaction]}
          />
        )}
      </div>
    </section>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
