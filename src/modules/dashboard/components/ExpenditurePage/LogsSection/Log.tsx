import React from 'react';
import { FormattedMessage } from 'react-intl';
import FriendlyName from '~core/FriendlyName';
import MemberReputation from '~core/MemberReputation';
import PermissionsLabel from '~core/PermissionsLabel';
import { TransactionMeta } from '~dashboard/ActionsPage';
import { AnyUser } from '~data/index';

import styles from './Log.css';
import { ExpenditureActions } from './types';

interface Props {
  actionType: ExpenditureActions | string;
  user: AnyUser;
  createdAt: number;
  blockExplorerName: string;
  transactionHash: string;
  amount?: string;
  funds?: string[];
  changes?: any[];
  colonyAddress: string;
  role?: number;
}

const Log = ({
  actionType,
  user,
  createdAt,
  transactionHash,
  amount,
  changes,
  colonyAddress,
  funds,
  role,
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.dotContainer}>
        <div className={styles.dot} />
      </div>
      <div className={styles.messageWrapper}>
        <FormattedMessage
          id="systemMessage.title"
          values={{
            name: actionType,
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
              changes?.map((change, index) => (
                <div className={styles.change}>
                  <FormattedMessage
                    id={`systemMessage.change.${change.changeType}`}
                    values={{
                      prevState: change.prevValue,
                      recipient: (
                        <span className={styles.userDecoration}>
                          @<FriendlyName user={change.recipient} />
                        </span>
                      ),
                      value: change.currValue,
                    }}
                  />
                  {index !== changes.length - 1 ? ',' : '.'}
                  {index === changes.length - 2 && ' and '}
                </div>
              )) || '',
            funds:
              funds?.map((fund, index) => (
                <div className={styles.change}>
                  {fund}
                  {index !== funds.length - 1 ? ',' : '.'}
                </div>
              )) || '',
          }}
        />
        <div className={styles.details}>
          {/* Role is temporaily value, there should be added logic to adding it based on response from the API */}
          {actionType && role && (
            <div className={styles.roles}>
              <PermissionsLabel
                appearance={{ theme: 'simple' }}
                permission={role}
                minimal
                infoMessageValues={{
                  role,
                  icon: (
                    <div className={styles.tooltipIcon}>
                      <PermissionsLabel
                        permission={role}
                        appearance={{ theme: 'white' }}
                      />
                    </div>
                  ),
                }}
              />
            </div>
          )}
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
    </div>
  );
};

export default Log;
