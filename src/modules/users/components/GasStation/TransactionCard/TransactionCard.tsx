import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import Card from '~core/Card';
import Heading from '~core/Heading';
import { TransactionType } from '~immutable/index';
import { arrayToObject } from '~utils/arrays';

import {
  getGroupKey,
  getGroupStatus,
  getGroupValues,
} from '../transactionGroup';
import TransactionStatus from './TransactionStatus';

import styles from './TransactionCard.css';

interface Props {
  idx: number;
  transactionGroup: TransactionType[];
  onClick?: (idx: number) => void;
}

const displayName = 'users.GasStation.TransactionCard';

const TransactionCard = ({ idx, transactionGroup, onClick }: Props) => {
  const handleClick = useCallback(() => {
    if (onClick) onClick(idx);
  }, [idx, onClick]);

  const groupKey = getGroupKey(transactionGroup);
  const status = getGroupStatus(transactionGroup);
  const values = getGroupValues<TransactionType>(transactionGroup);

  const defaultTransactionGroupMessageDescriptorTitleId = {
    id: `${
      transactionGroup[0].metatransaction ? 'meta' : ''
    }transaction.${groupKey}${
      transactionGroup[0].methodContext
        ? `.${transactionGroup[0].methodContext}`
        : ''
    }.title`,
  };
  const defaultTransactionGroupMessageDescriptorDescriptionId = {
    id: `${
      transactionGroup[0].metatransaction ? 'meta' : ''
    }transaction.${groupKey}${
      transactionGroup[0].methodContext
        ? `.${transactionGroup[0].methodContext}`
        : ''
    }.description`,
  };

  return (
    <Card className={styles.main}>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick}
        disabled={!onClick}
      >
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
          <TransactionStatus
            groupCount={transactionGroup.length}
            status={status}
          />
        </div>
      </button>
    </Card>
  );
};

TransactionCard.displayName = displayName;

export default TransactionCard;
