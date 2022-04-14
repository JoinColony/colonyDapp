import React, { useMemo, Dispatch, SetStateAction } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import { ParsedMotionStakedEvent, UserToken } from '~data/generated';

import { getFormattedTokenValue } from '~utils/tokens';
import { FullColonyFragment, useMotionsTxHashesQuery } from '~data/index';

import ClaimAllButton from './ClaimAllButton';
import StakesListItem from './StakesListItem';

import styles from './StakesTab.css';

const MSG = defineMessages({
  yourStakes: {
    id: 'users.TokenActivation.StakesTab.yourStakes',
    defaultMessage: 'Your stakes',
  },
  noClaims: {
    id: 'users.TokenActivation.StakesTab.noClaims',
    defaultMessage: 'There are no stakes to claim.',
  },
  buttonText: {
    id: 'users.TokenActivation.StakesTab.buttonText',
    defaultMessage: 'Claim all',
  },
});

export interface Props {
  unclaimedMotionStakeEvents?: Array<ParsedMotionStakedEvent>;
  isLoadingMotions: boolean;
  colony?: FullColonyFragment;
  walletAddress: Address;
  token: UserToken;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
}

const StakesTab = ({
  unclaimedMotionStakeEvents,
  isLoadingMotions,
  colony,
  walletAddress,
  token,
  setIsPopoverOpen,
}: Props) => {
  // extract flat array of motionIds
  const motionIds = useMemo(
    () =>
      unclaimedMotionStakeEvents &&
      unclaimedMotionStakeEvents.map((item) => item.values.motionId),
    [unclaimedMotionStakeEvents],
  );

  // get TX hashes for the motionIds
  const { data } = useMotionsTxHashesQuery({
    variables: {
      motionIds: motionIds || [],
      colonyAddress: colony?.colonyAddress || '',
    },
    fetchPolicy: 'network-only',
  });

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
              setIsPopoverOpen={setIsPopoverOpen}
            />
          </div>
          <ul data-test="claimableMotionsList">
            {unclaimedMotionStakeEvents?.map((motion) => (
              <StakesListItem
                stakedAmount={getFormattedTokenValue(
                  motion.values.stakeAmount,
                  token.decimals,
                )}
                tokenSymbol={token.symbol}
                colonyName={colony?.colonyName || ''}
                txHash={
                  data?.motionsTxHashes &&
                  data?.motionsTxHashes[motion.values.motionId]
                }
                setIsPopoverOpen={setIsPopoverOpen}
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
