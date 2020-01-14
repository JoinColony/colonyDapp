import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router';

import { DASHBOARD_ROUTE } from '~routes/index';
import { useSelector } from '~utils/hooks';
import { useCurrentUser } from '~data/helpers';

import { groupedTransactions } from '../../../core/selectors';
import {
  findTransactionGroupByKey,
  findNewestGroup,
} from '~users/GasStation/transactionGroup';
import Heading from '~core/Heading';
import Link from '~core/Link';
import GasStationContent from '~users/GasStation/GasStationContent';
import styles from './StepConfirmTransaction.css';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateUserWizard.StepConfirmTransaction.heading',
    defaultMessage: `Complete this transaction to continue
      setting up your account`,
  },
  later: {
    id: 'dashboard.CreateUserWizard.StepUserName.later',
    defaultMessage: `I'll do it later`,
  },
});

const displayName = 'dashboard.CreateUserWizard.StepConfirmTransaction';

const StepConfirmTransaction = () => {
  const { username } = useCurrentUser();
  const transactionGroups = useSelector(groupedTransactions);

  if (username) {
    return <Redirect to={DASHBOARD_ROUTE} />;
  }

  const colonyTransaction = findTransactionGroupByKey(
    [findNewestGroup(transactionGroups)],
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
