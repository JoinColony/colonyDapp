import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import { ParsedMotionStakedEvent, UserToken } from '~data/generated';

import { getFormattedTokenValue } from '~utils/tokens';
import { FullColonyFragment } from '~data/index';

import ClaimAllButton from './ClaimAllButton';
import StakesListItem from './StakesListItem';

import styles from './StakesTab.css';

const MSG = defineMessages({
  yourStakes: {
    id: 'TokenActivation.StakesTab.yourStakes',
    defaultMessage: 'Your stakes',
  },
  noClaims: {
    id: 'TokenActivation.StakesTab.noClaims',
    defaultMessage: 'There are no stakes to claim.',
  },
  buttonText: {
    id: 'TokenActivation.StakesTab.buttonText',
    defaultMessage: 'Claim all',
  },
});

export interface StakesTabProps {
  unclaimedMotionStakeEvents?: Array<ParsedMotionStakedEvent>;
  isLoadingMotions: boolean;
  colony?: FullColonyFragment;
  walletAddress: Address;
  token: UserToken;
}

const StakesTab = ({
  unclaimedMotionStakeEvents,
  isLoadingMotions,
  colony,
  walletAddress,
  token,
}: StakesTabProps) => {
  if (isLoadingMotions) {
    return (
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'medium' }} />
      </div>
    );
  }

  return (
    <div className={styles.stakesContainer}>
      {unclaimedMotionStakeEvents && unclaimedMotionStakeEvents?.length > 0 ? (
        <>
          <div className={styles.claimAllButtonSection}>
            <FormattedMessage {...MSG.yourStakes} />
            <ClaimAllButton
              unclaimedMotionStakeEvents={unclaimedMotionStakeEvents}
              userAddress={walletAddress}
              colonyAddress={colony?.colonyAddress || ''}
            />
          </div>
          <ul>
            {unclaimedMotionStakeEvents?.map((motion) => (
              <StakesListItem
                stakedAmount={getFormattedTokenValue(
                  motion.values.stakeAmount,
                  token.decimals,
                )}
                tokenSymbol={token.symbol}
                colonyName={colony?.colonyName}
                // This hash is incorrect. I suspect the ID should be used.
                txHash={motion.hash}
                key={motion.values.motionId}
              />
            ))}
          </ul>
        </>
      ) : (
        <div className={styles.noClaims}>
          <FormattedMessage {...MSG.noClaims} />
        </div>
      )}
    </div>
  );
};

export default StakesTab;
