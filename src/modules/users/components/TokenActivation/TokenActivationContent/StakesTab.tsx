import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';
import { Address } from '~types/index';
import { useClaimableStakedMotionsQuery } from '~data/generated';

import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  noClaims: {
    id: 'users.TokenActivation.TokenActivationContent.ClaimsTab.noClaims',
    defaultMessage: 'There are no stakes to claim.',
  },
});

export interface StakesTabProps {
  colonyAddress: Address;
  walletAddress: Address;
}

const StakesTab = ({ colonyAddress, walletAddress }: StakesTabProps) => {
  const { data: unclaimedMotions, loading } = useClaimableStakedMotionsQuery({
    variables: {
      colonyAddress: colonyAddress?.toLowerCase(),
      walletAddress: walletAddress?.toLowerCase(),
    },
    fetchPolicy: 'network-only',
  });

  return (
    <div className={styles.claimsContainer}>
      <div className={styles.noClaims}>
        {loading ? (
          <SpinnerLoader appearance={{ size: 'medium' }} />
        ) : (
          <>
            {unclaimedMotions &&
            unclaimedMotions.claimableStakedMotions?.motionIds.length > 0 ? (
              <span>[Claimable stakes appear here]</span>
            ) : (
              <FormattedMessage {...MSG.noClaims} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StakesTab;
