import React from 'react';
import { FormattedMessage } from 'react-intl';
import FriendlyName from '~core/FriendlyName';
import MemberReputation from '~core/MemberReputation';
import PermissionsLabel from '~core/PermissionsLabel';
import { TransactionMeta } from '~dashboard/ActionsPage';
import { ExtendedSystemMessage } from '~dashboard/ActionsPageFeed';

import styles from './Log.css';

const Log = ({
  name,
  user,
  createdAt,
  transactionHash,
  amount,
  changes,
  colonyAddress,
  funds,
  role,
}: ExtendedSystemMessage) => {
  return (
    <li className={styles.container}>
      <div className={styles.dotContainer}>
        <div className={styles.dot} />
      </div>
      <div className={styles.messageWrapper}>
        <FormattedMessage
          id="systemMessage.title"
          values={{
            name,
            amount,
            reputation: (
              <span className={styles.reputationStarWrapper}>
                <span className={styles.reputationWrapper}>
                  {user && colonyAddress && (
                    <MemberReputation
                      walletAddress={user.profile.walletAddress}
                      colonyAddress={colonyAddress}
                    />
                  )}
                </span>
              </span>
            ),
            user: (
              <span className={styles.userDecoration}>
                @<FriendlyName user={user} />
              </span>
            ),
            changes:
              changes?.map((change, index) => (
                <span
                  className={styles.change}
                  key={`${index}_${changes?.length}`}
                >
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
                </span>
              )) || '',
            funds:
              funds?.map((fund, index) => (
                <span
                  className={styles.change}
                  key={`${index}_${funds?.length}`}
                >
                  {fund}
                  {index !== funds.length - 1 ? ',' : '.'}
                </span>
              )) || '',
          }}
        />
        <div className={styles.details}>
          {/* Role is temporaily value, there should be added logic to adding it based on response from the API */}
          {name && role && (
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
    </li>
  );
};

export default Log;
