/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router';

import styles from './StepConfirmTransaction.css';

import { groupedTransactions } from '../../../core/selectors';

import Heading from '~core/Heading';
import Link from '~core/Link';

import GasStationContent from '~users/GasStation/GasStationContent';
import { useSelector } from '~utils/hooks';

import { DASHBOARD_ROUTE } from '~routes';

import {
  getGroupStatus,
  findTransactionGroupByKey,
  getGroupKey,
} from '~users/GasStation/transactionGroup';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransaction.heading',
    defaultMessage: `Complete this transaction to
      finish setting up your account.`,
  },
  later: {
    id: 'dashboard.CreateUserWizard.StepUserName.later',
    defaultMessage: `I'll do it later`,
  },
});

const displayName = 'dashboard.CreateUserWizard.StepConfirmTransaction';

const StepConfirmTransaction = () => {
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
            appearance={{ interactive: false, required: true }}
            transactionAndMessageGroups={[colonyTransaction]}
          />
        )}
      </div>
      <div className={styles.buttons}>
        <p className={styles.reminder}>
          <Link to={DASHBOARD_ROUTE}>
            <FormattedMessage {...MSG.later} />
          </Link>
        </p>
      </div>
    </section>
  );
};

StepConfirmTransaction.displayName = displayName;

export default StepConfirmTransaction;
