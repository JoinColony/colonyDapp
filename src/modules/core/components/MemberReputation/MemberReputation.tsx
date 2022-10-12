import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import Decimal from 'decimal.js';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useUserReputationQuery } from '~data/index';
import { Address } from '~types/index';
import Numeral from '~core/Numeral';
import Icon from '~core/Icon';
import { calculatePercentageReputation, ZeroValue } from '~utils/reputation';
import { getFormattedTokenValue } from '~utils/tokens';

import styles from './MemberReputation.css';

const MSG = defineMessages({
  starReputationTitle: {
    id: 'MemberReputation.starReputationTitle',
    defaultMessage: `User reputation value: {reputation}%`,
  },
  starNoReputationTitle: {
    id: 'MemberReputation.starNoReputationTitle',
    defaultMessage: `User has no reputation`,
  },
});

interface Props {
  walletAddress: Address;
  colonyAddress: Address;
  domainId?: number;
  rootHash?: string;
  onReputationLoaded?: (reputationLoaded: boolean) => void;
  showIconTitle?: boolean;
  showReputationPoints?: boolean;
  nativeTokenDecimals?: number;
}

const displayName = 'MemberReputation';

const MemberReputation = ({
  walletAddress,
  colonyAddress,
  domainId = ROOT_DOMAIN_ID,
  rootHash,
  onReputationLoaded = () => null,
  showIconTitle = true,
  showReputationPoints = false,
  nativeTokenDecimals = DEFAULT_TOKEN_DECIMALS,
}: Props) => {
  const { data: userReputationData } = useUserReputationQuery({
    variables: { address: walletAddress, colonyAddress, domainId, rootHash },
    fetchPolicy: 'cache-and-network',
  });

  const { data: totalReputation } = useUserReputationQuery({
    variables: {
      address: AddressZero,
      colonyAddress,
      domainId,
      rootHash,
    },
    fetchPolicy: 'cache-and-network',
  });

  const userPercentageReputation = calculatePercentageReputation(
    userReputationData?.userReputation,
    totalReputation?.userReputation,
  );
  const formattedReputationPoints = getFormattedTokenValue(
    new Decimal(userReputationData?.userReputation || 0).toString(),
    nativeTokenDecimals,
  );

  useEffect(() => {
    onReputationLoaded(!!userReputationData);
  }, [userReputationData, onReputationLoaded]);

  /* Doing this cause Eslint yells at me if I use nested ternary */
  let iconTitle;
  if (!showIconTitle) {
    iconTitle = undefined;
  } else {
    iconTitle = userPercentageReputation
      ? MSG.starReputationTitle
      : MSG.starNoReputationTitle;
  }

  return (
    <div className={styles.reputationWrapper}>
      {!userPercentageReputation && (
        <div className={styles.reputation}>— %</div>
      )}
      {userPercentageReputation === ZeroValue.NearZero && (
        <div className={styles.reputation}>{userPercentageReputation}</div>
      )}
      {userPercentageReputation &&
        userPercentageReputation !== ZeroValue.NearZero && (
          <Numeral
            className={styles.reputation}
            value={userPercentageReputation}
            suffix="%"
          />
        )}
      {showReputationPoints && (
        <div className={styles.reputationPointsContainer}>
          <span className={styles.reputationPoints}>(</span>
          <Numeral
            className={styles.reputationPoints}
            value={formattedReputationPoints}
            suffix="pts)"
          />
        </div>
      )}
      <Icon
        name="star"
        appearance={{ size: 'extraTiny' }}
        className={styles.icon}
        title={iconTitle}
        titleValues={
          showIconTitle
            ? {
                reputation: userPercentageReputation,
              }
            : undefined
        }
      />
    </div>
  );
};

MemberReputation.displayName = displayName;

export default MemberReputation;
