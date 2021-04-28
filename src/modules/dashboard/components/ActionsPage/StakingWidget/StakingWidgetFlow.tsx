import React, { useEffect, useState, RefObject } from 'react';
import formatNumber from 'format-number';
import { bigNumberify } from 'ethers/utils';

import { useLoggedInUser, Colony } from '~data/index';
import {
  useStakeAmountsForMotionQuery,
  useColonyNativeTokenQuery,
  useTokenInfoLazyQuery,
} from '~data/generated';

import SingleTotalStake from '../TotalStakeWidget/SingleTotalStake';
import GroupedTotalStake from '../TotalStakeWidget/GroupedTotalStake';

import StakingWidget from './StakingWidget';

import styles from './StakingWidget.css';

const displayName = 'StakingWidgetFlow';

export enum StakeSide {
  Motion = 'MOTION',
  Objection = 'OBJECTION',
}

export interface Props {
  colony: Colony;
  motionId: number;
  scrollToRef?: RefObject<HTMLInputElement>;
  transactionHash: string;
}

const StakingWidgetFlow = ({
  colony,
  motionId,
  scrollToRef,
  transactionHash,
}: Props) => {
  const [isSummary, setIsSummary] = useState(false);
  const [isObjection, setIsObjection] = useState(false);

  const { walletAddress, username, ethereal } = useLoggedInUser();
  const { data, loading } = useStakeAmountsForMotionQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });
  const { data: nativeTokenAddressData } = useColonyNativeTokenQuery({
    variables: { address: colony.colonyAddress },
  });
  const [fetchTokenInfo, { data: tokenInfoData }] = useTokenInfoLazyQuery();

  useEffect(() => {
    if (
      !bigNumberify(data?.stakeAmountsForMotion?.totalStaked?.NAY || 0).isZero()
    ) {
      setIsSummary(true);
    }
  }, [data]);

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

  const yayPercentage = bigNumberify(totalStaked.YAY || 0)
    .mul(100)
    .div(divisibleRequiredStake)
    .toNumber();
  const nayPercentage = bigNumberify(totalStaked.NAY || 0)
    .mul(100)
    .div(divisibleRequiredStake)
    .toNumber();
  const formattedYAYPercentage = formatNumber({
    truncate: 2,
  })(yayPercentage);
  const formattedNAYPercentage = formatNumber({
    truncate: 2,
  })(nayPercentage);

  return (
    <div className={styles.widget}>
      {!isSummary && (
        <SingleTotalStake
          userStake={isObjection ? userStake.NAY : userStake.YAY}
          requiredStake={divisibleRequiredStake}
          isObjection={isObjection}
          totalPercentage={!isObjection ? yayPercentage : nayPercentage}
          formattedTotalPercentage={
            !isObjection ? formattedYAYPercentage : formattedNAYPercentage
          }
          tokenDecimals={tokenInfoData?.tokenInfo.decimals}
          tokenSymbol={tokenInfoData?.tokenInfo.symbol}
        />
      )}
      {isSummary ? (
        <GroupedTotalStake
          requiredStake={requiredStake}
          formattedNAYPercentage={formattedNAYPercentage}
          formattedYAYPercentage={formattedYAYPercentage}
          tokenDecimals={tokenInfoData?.tokenInfo.decimals}
          tokenSymbol={tokenInfoData?.tokenInfo.symbol}
          isUserLoggedIn={!!(username && !ethereal)}
          handleSideSelect={setIsObjection}
          handleWidgetState={setIsSummary}
        />
      ) : (
        <StakingWidget
          isObjection={isObjection}
          scrollToRef={scrollToRef}
          motionId={motionId}
          colony={colony}
          transactionHash={transactionHash}
          handleWidgetState={setIsSummary}
        />
      )}
    </div>
  );
};

StakingWidgetFlow.displayName = displayName;

export default StakingWidgetFlow;
