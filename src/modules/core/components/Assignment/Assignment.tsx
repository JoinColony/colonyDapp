import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  TaskPayoutType,
  ColonyTokenReferenceType,
  TokenType,
} from '~immutable/index';
import { Address } from '~types/index';
import { AnyUser } from '~data/index';
import PayoutsList from '~core/PayoutsList';
import UserInfo from '~users/UserInfo';

import { getFriendlyName } from '../../../users/transformers';

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
    id: 'Assignment.reputation',
    defaultMessage: '+{reputation} max rep',
  },
});

interface Props {
  /** The worker that is assigned */
  worker?: AnyUser;

  /** The address of the above worker (used in the case of unclaimed worker profile) */
  workerAddress?: Address;

  /** List of payouts per token that has been set for a task */
  payouts?: TaskPayoutType[];

  /** current user reputation */
  reputation?: number;

  /** The assignment has to be confirmed first and can therefore appear as pending */
  pending?: boolean;

  /** We need to be aware of the native token to adjust the UI */
  nativeToken?: ColonyTokenReferenceType;

  /** Should the funding be rendered (if set) */
  showFunding?: boolean;

  /** Tokens available to the current colony */
  tokenOptions: TokenType[];
}

const Assignment = ({
  nativeToken,
  payouts,
  pending,
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
      <UserInfo
        userAddress={workerAddress}
        user={worker}
        placeholder={MSG.placeholder}
      >
        {worker ? getFriendlyName(worker) : workerAddress}
        {pending && (
          <span className={styles.pendingLabel}>
            <FormattedMessage {...MSG.pendingAssignment} />
          </span>
        )}
      </UserInfo>
      {showFunding && (
        <div className={styles.fundingContainer}>
          {reputation && fundingWithNativeToken ? (
            <span className={styles.reputation}>
              <FormattedMessage
                {...MSG.reputation}
                values={{ reputation: reputation.toString() }}
              />
            </span>
          ) : null}
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
  );
};

Assignment.defaultProps = { showFunding: true };

export default Assignment;
