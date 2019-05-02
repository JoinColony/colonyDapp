/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { Redirect } from 'react-router';

import styles from './StepConfirmTransaction.css';

import { groupedTransactions } from '../../../core/selectors';

import Heading from '~core/Heading';
import GasStationContent from '../../../users/components/GasStation/GasStationContent';
import { useSelector } from '~utils/hooks';

import { DASHBOARD_ROUTE } from '~routes';

import {
  getGroupStatus,
  findTransactionGroupByKey,
  getGroupKey,
} from '../../../users/components/GasStation/transactionGroup';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransaction.heading',
    defaultMessage: `Complete this transaction to
      finish setting up your account.`,
  },
});

const displayName = 'dashboard.CreateUserWizard.StepConfirmTransaction';

const StepConfirmTransactions = () => {
  const transactionGroups = useSelector(groupedTransactions);
  if (
    transactionGroups &&
    transactionGroups[0] &&
    getGroupStatus(transactionGroups[0]) === 'succeeded' &&
    getGroupKey(transactionGroups[0]) === 'group.transaction.batch.createUser'
  ) {
    return <Redirect to={DASHBOARD_ROUTE} />;
  }

  const colonyTransaction = findTransactionGroupByKey(
    transactionGroups,
    'group.transaction.batch.createUser',
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
