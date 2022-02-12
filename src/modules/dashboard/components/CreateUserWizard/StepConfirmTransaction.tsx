import React from 'react';
import { defineMessages } from 'react-intl';
import { Redirect, useHistory } from 'react-router-dom';

import { LANDING_PAGE_ROUTE } from '~routes/index';

import { useSelector } from '~utils/hooks';
import { useLoggedInUser } from '~data/index';

import { groupedTransactions } from '../../../core/selectors';
import {
  findTransactionGroupByKey,
  findNewestGroup,
} from '~users/GasStation/transactionGroup';
import Heading from '~core/Heading';
import GasStationContent from '~users/GasStation/GasStationContent';
import styles from './StepConfirmTransaction.css';
import { TRANSACTION_STATUSES } from '~immutable/Transaction';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransaction.heading',
    defaultMessage: `Complete this transaction to continue
      setting up your account`,
  },
});

const displayName = 'dashboard.CreateUserWizard.StepConfirmTransaction';

const StepConfirmTransaction = () => {
  const { username } = useLoggedInUser();
  const transactionGroups = useSelector(groupedTransactions);
  const { location } = useHistory<{ colonyURL?: string }>();

  const userCreatedTransactions = findTransactionGroupByKey(
    [findNewestGroup(transactionGroups)],
    'group.transaction.batch.createUser',
  );

  if (username) {
    // @ts-ignore
    if (userCreatedTransactions[0]?.status === TRANSACTION_STATUSES.SUCCEEDED) {
      return <Redirect to={`/user/${username}`} />;
    }

    if (location?.state?.colonyURL) {
      return <Redirect to={location.state.colonyURL} />;
    }

    return <Redirect to={LANDING_PAGE_ROUTE} />;
  }

  return (
    <section className={styles.main}>
      <Heading
        appearance={{ size: 'medium', weight: 'medium' }}
        text={MSG.heading}
      />
      <div className={styles.container}>
        {userCreatedTransactions && (
          <GasStationContent
            appearance={{ interactive: false, required: true }}
            transactionAndMessageGroups={[userCreatedTransactions]}
          />
        )}
      </div>
    </section>
  );
};

StepConfirmTransaction.displayName = displayName;

export default StepConfirmTransaction;
