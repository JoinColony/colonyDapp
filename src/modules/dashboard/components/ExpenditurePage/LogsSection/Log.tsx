import React from 'react';
import { FormattedMessage } from 'react-intl';
import FriendlyName from '~core/FriendlyName';
import MemberReputation from '~core/MemberReputation';
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
  changes?: any[];
  colonyAddress: string;
}

const Log = ({
  actionType,
  user,
  createdAt,
  transactionHash,
  amount,
  changes,
  colonyAddress,
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.dotContainer}>
        <div className={styles.dot} />
      </div>
      <div className={styles.messageWrapper}>
        <FormattedMessage
          id={`expenditure.${actionType}`}
          values={{
            amount,
            reputation: (
              <div className={styles.reputationStarWrapper}>
                <div className={styles.reputationWrapper}>
                  <MemberReputation
                    walletAddress={user?.profile.walletAddress}
                    colonyAddress={colonyAddress}
                  />
                </div>
              </div>
            ),
            user: (
              <span className={styles.userDecoration}>
                @<FriendlyName user={user} />
              </span>
            ),
            changes:
              changes?.map((change) => (
                <FormattedMessage
                  id="expenditure.change"
                  values={{
                    changeType: change.changeType,
                    prevState: change.prevValue,
                    recipient: (
                      <span className={styles.userDecoration}>
                        @<FriendlyName user={change.recipient} />
                      </span>
                    ),
                    value: change.currValue,
                  }}
                />
              )) || '',
          }}
        />
        {transactionHash && (
          <div className={styles.transactionMeta}>
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
