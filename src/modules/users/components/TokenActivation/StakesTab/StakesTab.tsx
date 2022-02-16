import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import { useClaimableStakedMotionsQuery, UserToken } from '~data/generated';

import { getFormattedTokenValue } from '~utils/tokens';
import { FullColonyFragment } from '~data/index';

import ClaimAllButton from './ClaimAllButton';
import StakesListItem from './StakesListItem';

import styles from './StakesTab.css';

const MSG = defineMessages({
  yourStakes: {
    id: 'users.TokenActivation.TokenActivationContent.StakesTab.yourStakes',
    defaultMessage: 'Your stakes',
  },
  noClaims: {
    id: 'users.TokenActivation.TokenActivationContent.ClaimsTab.noClaims',
    defaultMessage: 'There are no stakes to claim.',
  },
  buttonText: {
    id: 'users.TokenActivation.TokenActivationContent.StakesTab.buttonText',
    defaultMessage: 'Claim all',
  },
});

export interface StakesTabProps {
  colony?: FullColonyFragment;
  walletAddress: Address;
  token: UserToken;
}

const StakesTab = ({ colony, walletAddress, token }: StakesTabProps) => {
  const { data, loading } = useClaimableStakedMotionsQuery({
    variables: {
      colonyAddress: colony?.colonyAddress.toLowerCase() || '',
      walletAddress: walletAddress?.toLowerCase(),
    },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'medium' }} />
      </div>
    );
  }

  return (
    <div className={styles.stakesContainer}>
      {(data?.claimableStakedMotions.unclaimedMotionStakeEvents?.length || 0) >
      0 ? (
        <div className={styles.claimStakesContainer}>
          <div className={styles.claimAllButtonSection}>
            <FormattedMessage {...MSG.yourStakes} />
            {/* {claimsCount > 0 && (
                <div className={styles.dot}>{claimsCount}</div> */}
            {data?.claimableStakedMotions.unclaimedMotionStakeEvents && (
              <ClaimAllButton
                unclaimedMotionStakeEvents={
                  data.claimableStakedMotions.unclaimedMotionStakeEvents
                }
                userAddress={walletAddress}
                colonyAddress={colony?.colonyAddress || ''}
              />
            )}
          </div>
          <ul>
            {data?.claimableStakedMotions.unclaimedMotionStakeEvents.map(
              (motion) => (
                <StakesListItem
                  stakedAmount={getFormattedTokenValue(
                    motion.values.stakeAmount,
                    token.decimals,
                  )}
                  tokenSymbol={token.symbol}
                  colonyName={colony?.colonyName}
                  txHash="" // {motion.hash}
                  key={motion.values.motionId}
                />
              ),
            )}
          </ul>
        </div>
      ) : (
        <div className={styles.noClaims}>
          <FormattedMessage {...MSG.noClaims} />
        </div>
      )}
    </div>
  );
};

export default StakesTab;
