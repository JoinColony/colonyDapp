/* @flow */
import React from 'react';
import BN from 'bn.js';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './Assignment.css';

import Icon from '~core/Icon';
import UserAvatar from '~core/UserAvatar';
import PayoutsList from '~core/PayoutsList';

const MSG = defineMessages({
  selectMember: {
    id: 'Assignment.selectMember',
    defaultMessage: 'Select member',
  },
  emptyMessage: {
    id: 'Assignment.emptyMessage',
    defaultMessage: 'No Colony members match that search.',
  },
  fundingNotSet: {
    id: 'Assignment.fundingNotSet',
    defaultMessage: 'Funding not set',
  },
  pendingAssignment: {
    id: 'Assignment.pendingAssignment',
    defaultMessage: 'Pending',
  },
  placeholder: {
    id: 'Assignment.placeholder',
    defaultMessage: 'Unassigned',
  },
  reputation: {
    id: 'dashboard.TaskList.TaskListItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
});

// Until these types are fully specified we can user these
type Payout = {
  symbol: string,
  amount: number | string | BN,
};

type UserData = {
  walletAddress: string,
  username: string,
  displayName: string,
};

type Props = {
  assignee?: UserData,
  /** Array of payouts per token that has been set for a task */
  payouts?: Array<Payout>,
  /** current user reputation */
  reputation?: number,
  /** The assignment has to be confirmed first and can therefore appear as pending,
   * since this component is only
   */
  pending?: boolean,
};

const Assignment = ({ assignee, payouts, reputation, pending }: Props) => (
  <div>
    <div className={styles.displayContainer}>
      {assignee ? (
        <div className={styles.avatarContainer}>
          <UserAvatar
            className={styles.recipientAvatar}
            userId={assignee.walletAddress}
            walletAddress={assignee.walletAddress}
            username={assignee.username || assignee.walletAddress}
            size="xs"
          />
        </div>
      ) : (
        <Icon
          className={styles.icon}
          name="circle-person"
          title={MSG.selectMember}
        />
      )}
      {}
      <div className={styles.container}>
        {/* eslint-disable jsx-a11y/click-events-have-key-events */
        assignee ? (
          <div
            role="button"
            className={pending ? styles.pending : styles.assigneeName}
            tabIndex="0"
          >
            {assignee.displayName}
            {pending && (
              <span className={styles.pendingLabel}>
                <FormattedMessage {...MSG.pendingAssignment} />
              </span>
            )}
          </div>
        ) : (
          <div className={styles.placeholder}>
            <FormattedMessage {...MSG.placeholder} />
          </div>
        )}
      </div>
      <div className={styles.fundingContainer}>
        {reputation && (
          // TODO: check if funding token is native once we have a helper for it
          <span className={styles.reputation}>
            <FormattedMessage
              {...MSG.reputation}
              values={{ reputation: reputation.toString() }}
            />
          </span>
        )}
        {payouts ? (
          <PayoutsList payouts={payouts} nativeToken="CLNY" maxLines={2} />
        ) : (
          <FormattedMessage {...MSG.fundingNotSet} />
        )}
      </div>
    </div>
  </div>
);

export default Assignment;
