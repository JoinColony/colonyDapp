import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import { AnyUser, Payouts } from '~data/index';
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
  payouts?: Payouts;

  /** current user reputation */
  reputation?: number;

  /** The assignment has to be confirmed first and can therefore appear as pending */
  pending?: boolean;

  /** Should the funding be rendered (if set) */
  showFunding?: boolean;

  /** Ahem... */
  nativeTokenAddress: Address;
}

const Assignment = ({
  nativeTokenAddress,
  payouts,
  pending,
  reputation,
  showFunding,
  worker,
  workerAddress,
}: Props) => {
  const fundingWithNativeToken =
    payouts &&
    payouts.find(payout => payout.token.address === nativeTokenAddress);

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
          {payouts && payouts.length > 0 ? (
            <PayoutsList
              maxLines={2}
              nativeTokenAddress={nativeTokenAddress}
              payouts={payouts}
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
