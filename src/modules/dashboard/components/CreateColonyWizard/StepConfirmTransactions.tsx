import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { Redirect } from 'react-router';
import { useDispatch } from 'redux-react-hook';

import { WizardProps } from '~core/Wizard';
import { groupedTransactions } from '../../../core/selectors';
import Heading from '~core/Heading';
import GasStationContent from '../../../users/components/GasStation/GasStationContent';
import { useSelector } from '~utils/hooks';
import { log } from '~utils/debug';
import ENS from '~lib/ENS';
import {
  getGroupStatus,
  findTransactionGroupByKey,
  getGroupKey,
  findNewestGroup,
} from '../../../users/components/GasStation/transactionGroup';
import { TRANSACTION_STATUSES } from '~immutable/Transaction';
import { ActionTypes } from '~redux/index';

import styles from './StepConfirmTransactions.css';

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

interface FormValues {
  colonyName: string;
}

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepConfirmTransactions';

const StepConfirmTransactions = ({ wizardValues: { colonyName } }: Props) => {
  const dispatch = useDispatch();

  // Cancel the saga when the component unmounts
  useEffect(
    () => () => {
      dispatch({ type: ActionTypes.COLONY_CREATE_CANCEL });
    },
    [dispatch],
  );

  const txGroups = useSelector(groupedTransactions);
  const newestGroup = findNewestGroup(txGroups);

  // Redirect to the colony if a successful creteColony tx group is found
  if (
    getGroupStatus(newestGroup) === TRANSACTION_STATUSES.SUCCEEDED &&
    getGroupKey(newestGroup) === 'group.createColony'
  ) {
    const normalizedColonyName = ENS.normalizeAsText(colonyName);
    // This should never happen
    if (!normalizedColonyName)
      log.error(`The colonyName '${colonyName}' could not be normalized`);
    return <Redirect to={`/colony/${normalizedColonyName || colonyName}`} />;
  }

  const createColonyTxGroup = findTransactionGroupByKey(
    txGroups,
    'group.createColony',
  );

  return (
    <section className={styles.main}>
      <Heading
        appearance={{ size: 'medium', weight: 'medium' }}
        text={MSG.heading}
      />
      <div className={styles.container}>
        {createColonyTxGroup && (
          <GasStationContent
            appearance={{ interactive: false, required: true }}
            transactionAndMessageGroups={[createColonyTxGroup]}
          />
        )}
      </div>
    </section>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
