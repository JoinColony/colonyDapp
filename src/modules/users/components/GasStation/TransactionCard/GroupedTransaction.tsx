import React from 'react';
import { FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Card from '~core/Card';
import { TransactionType } from '~immutable/index';
import { SimpleMessageValues } from '~types/index';

import {
  getGroupKey,
  getGroupStatus,
  getGroupValues,
} from '../transactionGroup';
import { Appearance } from '../GasStationContent';
import GroupedTransactionCard from './GroupedTransactionCard';
import TransactionStatus from './TransactionStatus';
import styles from './GroupedTransaction.css';

interface Props {
  appearance: Appearance;
  transactionGroup: TransactionType[];
  selectedTransactionIdx: number;
}

const displayName = 'users.GasStation.GroupedTransaction';

const GroupedTransaction = ({
  appearance,
  selectedTransactionIdx,
  transactionGroup,
}: Props) => {
  const { interactive } = appearance;
  const groupKey = getGroupKey(transactionGroup);
  const status = getGroupStatus(transactionGroup);
  const values = getGroupValues<TransactionType>(transactionGroup);
  return (
    <Card className={styles.main}>
      {interactive && (
        <div className={styles.summary}>
          <div className={styles.description}>
            <Heading
              appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
              text={{ id: `transaction.${groupKey}.title` }}
              textValues={values.params as SimpleMessageValues}
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
          {/* For multisig, we have to pass in _something_ */}
          <TransactionStatus
            groupCount={transactionGroup.length}
            status={status}
            // multisig={{}}
          />
        </div>
      )}
      <ul
        className={styles.transactionList}
        data-test="gasStationGroupedTransaction"
      >
        {transactionGroup.map((transaction, idx) => (
          <GroupedTransactionCard
            key={transaction.id}
            idx={idx}
            selected={idx === selectedTransactionIdx}
            transaction={transaction}
            appearance={appearance}
          />
        ))}
      </ul>
    </Card>
  );
};

GroupedTransaction.displayName = displayName;

export default GroupedTransaction;
