import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { useUserReputationQuery } from '~data/index';
import { Address } from '~types/index';
import Numeral from '~core/Numeral';
import Icon from '~core/Icon';
import { calculatePercentageReputation, ZeroValue } from '~utils/reputation';

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
}

const displayName = 'MemberReputation';

const MemberReputation = ({
  walletAddress,
  colonyAddress,
  domainId = ROOT_DOMAIN_ID,
  rootHash,
  onReputationLoaded = () => null,
  showIconTitle = true,
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
    },
    fetchPolicy: 'cache-and-network',
  });

  const userPercentageReputation = calculatePercentageReputation(
    userReputationData?.userReputation,
    totalReputation?.userReputation,
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
    <div>
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
            appearance={{ theme: 'primary' }}
            value={userPercentageReputation}
            suffix="%"
          />
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
