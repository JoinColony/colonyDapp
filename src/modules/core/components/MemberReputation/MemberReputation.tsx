import React from 'react';
import { defineMessages } from 'react-intl';

import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import { bigNumberify } from 'ethers/utils';

import { useUserReputationQuery } from '~data/index';
import { Address } from '~types/index';
import Numeral from '~core/Numeral';
import Icon from '~core/Icon';

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
}

interface Reputation {
  userReputation: string;
}

enum ZeroValue {
  Zero = '0',
  NearZero = '~0',
}

type PercentageReputationType = ZeroValue | number | null;

export const calculatePercentageReputation = (
  decimalPlaces: number,
  userReputation?: Reputation,
  totalReputation?: Reputation,
): PercentageReputationType => {
  if (!userReputation || !totalReputation) return null;
  const userReputationNumber = bigNumberify(userReputation.userReputation);
  const totalReputationNumber = bigNumberify(totalReputation.userReputation);

  const reputationSafeguard = bigNumberify(100).pow(decimalPlaces);

  if (userReputationNumber.isZero()) {
    return ZeroValue.Zero;
  }

  if (userReputationNumber.mul(reputationSafeguard).lt(totalReputationNumber)) {
    return ZeroValue.NearZero;
  }

  const reputation = userReputationNumber
    .mul(reputationSafeguard)
    .div(totalReputationNumber)
    .toNumber();

  return reputation / 10 ** decimalPlaces;
};

const DECIMAL_PLACES = 2;

const displayName = 'MemberReputation';

const MemberReputation = ({
  walletAddress,
  colonyAddress,
  domainId = ROOT_DOMAIN_ID,
  rootHash,
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
    DECIMAL_PLACES,
    userReputationData,
    totalReputation,
  );
  return (
    <div>
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
    </div>
  );
};

MemberReputation.displayName = displayName;

export default MemberReputation;
