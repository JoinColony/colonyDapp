import React from 'react';
import { FormattedMessage } from 'react-intl';
import FriendlyName from '~core/FriendlyName';
import { TransactionMeta } from '~dashboard/ActionsPage';
import { AnyUser } from '~data/index';

import styles from './Log.css';
import { ExpenditureActions } from './types';

interface Props {
  actionType: ExpenditureActions | string;
  user: AnyUser;
  values: any;
  createdAt: number;
  blockExplorerName: string;
  transactionHash: string;
  amount: string;
}

const Log = ({
  actionType,
  user,
  createdAt,
  transactionHash,
  amount,
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.dot} />
      <div className={styles.messageWrapper}>
        <FormattedMessage
          id={`expenditure.${actionType}`}
          values={{
            amount,
            user: (
              <span className={styles.userDecoration}>
                @<FriendlyName user={user} />
              </span>
            ),
          }}
        />
        {transactionHash && (
          <div>
            <TransactionMeta
              transactionHash={transactionHash}
              createdAt={new Date(createdAt)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Log;
