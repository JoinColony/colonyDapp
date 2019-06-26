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
import { getNormalizedDomainText } from '~utils/strings';
import { log } from '~utils/debug';

import {
  getGroupStatus,
  findTransactionGroupByKey,
  getGroupKey,
  findNewestGroup,
} from '../../../users/components/GasStation/transactionGroup';

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

type FormValues = { colonyName: string };

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepConfirmTransactions';

const StepConfirmTransactions = ({ wizardValues: { colonyName } }: Props) => {
  const transactionGroups = useSelector(groupedTransactions);
  const newestGroup = findNewestGroup(transactionGroups);
  if (
    getGroupStatus(newestGroup) === 'succeeded' &&
    getGroupKey(newestGroup) === 'group.createColony'
  ) {
    const normalizedColonyName = getNormalizedDomainText(colonyName);
    // This should never happen
    if (!normalizedColonyName)
      log.error(`The colonyName '${colonyName}' could not be normalized`);
    return <Redirect to={`/colony/${normalizedColonyName || colonyName}`} />;
  }

  const colonyTransaction = findTransactionGroupByKey(
    transactionGroups,
    'group.createColony',
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
            transactionAndMessageGroups={[colonyTransaction]}
          />
        )}
      </div>
    </section>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
