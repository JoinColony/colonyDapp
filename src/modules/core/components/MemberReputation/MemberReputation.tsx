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
}

const displayName = 'MemberReputation';

const MemberReputation = ({
  walletAddress,
  colonyAddress,
  domainId = ROOT_DOMAIN_ID,
  rootHash,
  onReputationLoaded = () => null,
}: Props) => {
  const { data: userReputationData } = useUserReputationQuery({
    variables: { address: walletAddress, colonyAddress, domainId, rootHash },
    fetchPolicy: 'network-only',
  });

  const { data: totalReputation } = useUserReputationQuery({
    variables: {
      address: AddressZero,
      colonyAddress,
      domainId,
    },
    fetchPolicy: 'network-only',
  });

  const userPercentageReputation = calculatePercentageReputation(
    userReputationData?.userReputation,
    totalReputation?.userReputation,
  );

  useEffect(() => {
    onReputationLoaded(!!userReputationData);
  }, [userReputationData, onReputationLoaded]);

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
        title={
          userPercentageReputation
            ? MSG.starReputationTitle
            : MSG.starNoReputationTitle
        }
        titleValues={{
          reputation: userPercentageReputation,
        }}
      />
    </div>
  );
};

MemberReputation.displayName = displayName;

export default MemberReputation;
