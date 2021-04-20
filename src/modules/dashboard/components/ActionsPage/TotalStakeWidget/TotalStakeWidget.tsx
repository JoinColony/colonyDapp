import React, { useEffect } from 'react';
import formatNumber from 'format-number';
import { bigNumberify } from 'ethers/utils';

import { useLoggedInUser } from '~data/index';
import {
  useStakeAmountsForMotionQuery,
  useColonyNativeTokenQuery,
  useTokenInfoLazyQuery,
} from '~data/generated';
import { Address } from '~types/index';

import SingleTotalStake from './SingleTotalStake';
import GroupedTotalStake from './GroupedTotalStake';

import styles from './TotalStakeWidget.css';

const displayName = 'TotalStakeWidget';

export enum StakeSide {
  Motion = 'MOTION',
  Objection = 'OBJECTION',
  Both = 'BOTH',
}

type Props = {
  colonyAddress: Address;
  motionId: number;
  stakeSide?: string;
};

const TotalStakeWidget = ({
  colonyAddress,
  motionId,
  stakeSide = StakeSide.Motion,
}: Props) => {
  const { walletAddress } = useLoggedInUser();
  const { data, loading } = useStakeAmountsForMotionQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
      stakeSide,
    },
  });
  const { data: nativeTokenAddressData } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });
  const [fetchTokenInfo, { data: tokenInfoData }] = useTokenInfoLazyQuery();

  useEffect(() => {
    if (nativeTokenAddressData) {
      const {
        processedColony: { nativeTokenAddress },
      } = nativeTokenAddressData;
      fetchTokenInfo({ variables: { address: nativeTokenAddress } });
    }
  }, [fetchTokenInfo, nativeTokenAddressData]);

  if (loading || !data?.stakeAmountsForMotion) {
    return null;
  }

  const { totalStaked, userStake, requiredStake } = data.stakeAmountsForMotion;
  const divisibleRequiredStake = !bigNumberify(requiredStake).isZero()
    ? requiredStake
    : 1;

  const totalYAYStakedPercentage = bigNumberify(totalStaked.YAY || 0)
    .mul(100)
    .div(divisibleRequiredStake)
    .toNumber();
  const totalNAYStakedPercentage = bigNumberify(totalStaked.NAY || 0)
    .mul(100)
    .div(divisibleRequiredStake)
    .toNumber();
  const formattedTotalYAYStakedPercentage = formatNumber({
    truncate: 2,
  })(totalYAYStakedPercentage);
  const formattedTotalNAYStakedPercentage = formatNumber({
    truncate: 2,
  })(totalNAYStakedPercentage);

  return (
    <div className={styles.widget}>
      {stakeSide !== StakeSide.Both && (
        <SingleTotalStake
          userStake={userStake}
          requiredStake={divisibleRequiredStake}
          stakeSide={stakeSide}
          totalPercentage={
            stakeSide === StakeSide.Motion
              ? totalYAYStakedPercentage
              : totalNAYStakedPercentage
          }
          formattedTotalPercentage={
            stakeSide === StakeSide.Motion
              ? formattedTotalYAYStakedPercentage
              : formattedTotalNAYStakedPercentage
          }
          tokenDecimals={tokenInfoData?.tokenInfo.decimals}
          tokenSymbol={tokenInfoData?.tokenInfo.symbol}
        />
      )}
      {stakeSide === StakeSide.Both && (
        <GroupedTotalStake
          requiredStake={requiredStake}
          formattedTotalNAYStakedPercentage={formattedTotalNAYStakedPercentage}
          formattedTotalYAYStakedPercentage={formattedTotalYAYStakedPercentage}
          tokenDecimals={tokenInfoData?.tokenInfo.decimals}
          tokenSymbol={tokenInfoData?.tokenInfo.symbol}
        />
      )}
    </div>
  );
};

TotalStakeWidget.displayName = displayName;

export default TotalStakeWidget;
