import React from 'react';
import { FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Card from '~core/Card';
import { TransactionType } from '~immutable/index';
import { arrayToObject } from '~utils/arrays';

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

  const defaultTransactionGroupMessageDescriptorTitleId = {
    id: `${
      transactionGroup[0].metatransaction ? 'meta' : ''
    }transaction.${groupKey}.title`,
  };
  const defaultTransactionGroupMessageDescriptorDescriptionId = {
    id: process.env.DEBUG
      ? `${
          transactionGroup[0].metatransaction ? 'meta' : ''
        }transaction.debug.description`
      : `${
          transactionGroup[0].metatransaction ? 'meta' : ''
        }transaction.${groupKey}.description`,
  };

  return (
    <Card className={styles.main}>
      {interactive && (
        <div className={styles.summary}>
          <div className={styles.description}>
            <Heading
              appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
              text={{
                ...defaultTransactionGroupMessageDescriptorTitleId,
                ...values.group?.title,
              }}
              textValues={
                values.group?.titleValues || arrayToObject(values.params)
              }
            />
            <FormattedMessage
              {...defaultTransactionGroupMessageDescriptorDescriptionId}
              {...values.group?.description}
              values={
                values.group?.descriptionValues || arrayToObject(values.params)
              }
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
