import React, { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  TaskPayoutType,
  TokenReferenceType,
  TokenType,
  UserType,
} from '~immutable/index';
import { Address } from '~types/index';
import Icon from '~core/Icon';
import MaskedAddress from '~core/MaskedAddress';
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

interface Props {
  /** The worker that is assigned */
  worker: UserType | void;

  /** The address of the above worker (used in the case of unclaimed worker profile) */
  workerAddress: Address | void;

  /** List of payouts per token that has been set for a task */
  payouts?: TaskPayoutType[];

  /** Provide a custom component to render the user avatar */
  renderAvatar?: (address: Address, user: UserType | void) => ReactNode;

  /** current user reputation */
  reputation?: number;

  /** The assignment has to be confirmed first and can therefore appear as pending,
   * since this component is only
   */
  pending?: boolean;

  /** We need to be aware of the native token to adjust the UI */
  nativeToken: TokenReferenceType | void;

  /** Should the funding be rendered (if set) */
  showFunding?: boolean;

  /** Tokens available to the current colony */
  tokenOptions: TokenType[];
}

const defaultRenderAvatar = (address: Address, user: UserType | void) => (
  <UserAvatar address={address} user={user} showInfo size="xs" />
);

const Assignment = ({
  nativeToken,
  payouts,
  pending,
  renderAvatar = defaultRenderAvatar,
  reputation,
  showFunding,
  tokenOptions,
  worker,
  workerAddress,
}: Props) => {
  const fundingWithNativeToken =
    payouts &&
    nativeToken &&
    payouts.find(payout => payout.token === nativeToken.address);

  return (
    <div>
      <div className={styles.displayContainer}>
        {workerAddress ? (
          <div className={styles.avatarContainer}>
            {renderAvatar(workerAddress, worker)}
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
              {workerAddress ? (
                <MaskedAddress address={workerAddress} />
              ) : (
                <FormattedMessage {...MSG.placeholder} />
              )}
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
            {nativeToken && payouts && payouts.length > 0 ? (
              <PayoutsList
                maxLines={2}
                nativeToken={nativeToken}
                payouts={payouts}
                tokenOptions={tokenOptions}
              />
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
