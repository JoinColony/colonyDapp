/* @flow */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Card from '~core/Card';

import type { TransactionGroup } from '../transactionGroup';
import type { Appearance } from '../GasStationContent';

import {
  getGroupKey,
  getGroupStatus,
  getGroupValues,
} from '../transactionGroup';

import styles from './GroupedTransaction.css';

import GroupedTransactionCard from './GroupedTransactionCard';
import TransactionStatus from './TransactionStatus.jsx';

type Props = {
  appearance: Appearance,
  transactionGroup: TransactionGroup,
  selectedTransactionIdx: number,
};

const displayName = 'users.GasStation.GroupedTransaction';

const GroupedTransaction = ({
  appearance = { interactive: true },
  selectedTransactionIdx,
  transactionGroup,
}: Props) => {
  const { interactive } = appearance;
  const groupKey = getGroupKey(transactionGroup);
  const status = getGroupStatus(transactionGroup);
  const values = getGroupValues(transactionGroup);
  return (
    <Card className={styles.main}>
      {interactive && (
        <div className={styles.summary}>
          <div className={styles.description}>
            <Heading
              appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
              text={{ id: `transaction.${groupKey}.title` }}
              textValues={values.params}
            />
            <FormattedMessage
              id={
                process.env.DEBUG
                  ? `transaction.debug.description`
                  : `transaction.${groupKey}.description`
              }
              values={values.params}
            />
          </div>
          {/* TODO-multisig: we have to pass in _something_ */}
          <TransactionStatus
            groupCount={transactionGroup.length}
            status={status}
            multisig={{}}
          />
        </div>
      )}
      <ul className={styles.transactionList}>
        {transactionGroup.map((transaction, idx) => (
          <GroupedTransactionCard
            key={transaction.id}
            idx={idx}
            selected={idx === selectedTransactionIdx}
            transaction={transaction}
          />
        ))}
      </ul>
    </Card>
  );
};

GroupedTransaction.displayName = displayName;

export default GroupedTransaction;
