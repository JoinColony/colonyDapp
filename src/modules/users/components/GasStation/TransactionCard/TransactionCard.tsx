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
                id: `transaction.${groupKey}${
                  transactionGroup[0].methodContext
                    ? `.${transactionGroup[0].methodContext}`
                    : ''
                }.title`,
              }}
              textValues={arrayToObject(values.params)}
            />
            <FormattedMessage
              id={`transaction.${groupKey}${
                transactionGroup[0].methodContext
                  ? `.${transactionGroup[0].methodContext}`
                  : ''
              }.description`}
              values={arrayToObject(values.params)}
            />
          </div>
          {/* For multisig, how do we pass it in here? */}
          <TransactionStatus
            groupCount={transactionGroup.length}
            status={status}
            // multisig={{}}
          />
        </div>
      </button>
    </Card>
  );
};

TransactionCard.displayName = displayName;

export default TransactionCard;
