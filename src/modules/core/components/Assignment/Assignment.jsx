/* @flow */

import type { Node } from 'react';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TaskPayoutType, TokenReferenceType, UserType } from '~immutable';
import type { Address } from '~types';

import Icon from '~core/Icon';
import PayoutsList from '~core/PayoutsList';
import HookedUserAvatar from '~users/HookedUserAvatar';

import styles from './Assignment.css';

const MSG = defineMessages({
  selectMember: {
    id: 'Assignment.selectMember',
    defaultMessage: 'Select member',
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

const UserAvatar = HookedUserAvatar({ fetchUser: false });

type Props = {|
  worker: ?UserType,
  /** List of payouts per token that has been set for a task */
  payouts?: Array<TaskPayoutType>,
  renderAvatar?: (address: Address, user: UserType) => Node,
  /** current user reputation */
  reputation?: number,
  /** The assignment has to be confirmed first and can therefore appear as pending,
   * since this component is only
   */
  pending?: boolean,
  /** We need to be aware of the native token to adjust the UI */
  nativeToken: TokenReferenceType,
  showFunding?: boolean,
|};

const defaultRenderAvatar = (address: Address, user: UserType) => (
  <UserAvatar
    address={address}
    className={styles.recipientAvatar}
    user={user}
    size="xs"
  />
);

const Assignment = ({
  nativeToken,
  payouts,
  pending,
  renderAvatar = defaultRenderAvatar,
  reputation,
  showFunding,
  worker,
}: Props) => {
  const fundingWithNativeToken =
    payouts &&
    payouts.find(payout => payout.token.address === nativeToken.address);

  return (
    <div>
      <div className={styles.displayContainer}>
        {worker ? (
          <div className={styles.avatarContainer}>
            {renderAvatar(worker.profile.walletAddress, worker)}
          </div>
        ) : (
          <Icon
            className={styles.icon}
            name="circle-person"
            title={MSG.selectMember}
          />
        )}
        <div className={styles.container}>
          {worker ? (
            <div
              role="button"
              className={pending ? styles.pending : styles.assigneeName}
            >
              {worker.profile.displayName || worker.profile.username}
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
        {showFunding && (
          <div className={styles.fundingContainer}>
            {reputation && fundingWithNativeToken && (
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
        )}
      </div>
    </div>
  );
};

Assignment.defaultProps = { showFunding: true };

export default Assignment;
