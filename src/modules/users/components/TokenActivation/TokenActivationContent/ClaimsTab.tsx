import React, { useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Extension } from '@colony/colony-js';

import { SpinnerLoader } from '~core/Preloaders';
import { Address } from '~types/index';
import {
  useColonyExtensionsQuery,
  useSubgraphUserMotionTokenEventsQuery,
} from '~data/generated';

import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  noClaims: {
    id: 'users.TokenActivation.TokenActivationContent.ClaimsTab.noClaims',
    defaultMessage: 'There are no stakes to claim.',
  },
});

export interface ClaimsTabProps {
  colonyAddress: Address;
  walletAddress: Address;
}

const ClaimsTab = ({ colonyAddress, walletAddress }: ClaimsTabProps) => {
  const { data: extensions } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const { installedExtensions } = extensions?.processedColony || {};

  const votingReputationExtension = installedExtensions?.find(
    ({ extensionId }) => extensionId === Extension.VotingReputation,
  );

  const {
    data: userStakedMotions,
    loading,
  } = useSubgraphUserMotionTokenEventsQuery({
    variables: {
      colonyAddress: colonyAddress?.toLowerCase(),
      walletAddress: walletAddress?.toLowerCase(),
      extensionAddress: votingReputationExtension?.address?.toLowerCase() || '',
      sortDirection: 'desc',
    },
  });

  const unclaimedMotions = useMemo(() => {
    /* Get array of already claimed motionIds within argument string */
    const alreadyClaimedMotions =
      userStakedMotions?.motionRewardClaimedEvents.map((event) => {
        return JSON.parse(event.args).motionId;
      }) || [];

    /* Get array of claimable motionIds */
    if (
      userStakedMotions?.motionStakedEvents &&
      userStakedMotions.motionStakedEvents?.length > 0
    ) {
      return (
        userStakedMotions.motionStakedEvents
          /* Map event motionIds */
          .map((event) => JSON.parse(event.args).motionId)
          /* Filter out already claimed motions */
          .filter((motionId) => !alreadyClaimedMotions.includes(motionId))
          /* Remove duplicate motionIds */
          .filter((motionId, index, arr) => arr.indexOf(motionId) === index)
      );
    }
    return [];
  }, [userStakedMotions]);

  return (
    <div className={styles.claimsContainer}>
      <div className={styles.noClaims}>
        {loading ? (
          <SpinnerLoader appearance={{ size: 'medium' }} />
        ) : (
          <>
            {unclaimedMotions && unclaimedMotions.length > 0 ? (
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

export default ClaimsTab;
