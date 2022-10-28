import React, { useEffect, useState, RefObject } from 'react';
import { defineMessages } from 'react-intl';
import formatNumber from 'format-number';
import { bigNumberify } from 'ethers/utils';

import { MiniSpinnerLoader } from '~core/Preloaders';

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

export interface Props {
  colony: Colony;
  motionId: number;
  isDecision: boolean;
  scrollToRef?: RefObject<HTMLInputElement>;
}

const MSG = defineMessages({
  loading: {
    id: 'dashboard.ActionsPage.StakingWidget.loading',
    defaultMessage: 'Loading staking values ...',
  },
});

const StakingWidgetFlow = ({
  colony,
  motionId,
  isDecision,
  scrollToRef,
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
    return (
      <div className={styles.main}>
        <MiniSpinnerLoader
          className={styles.loading}
          loadingText={MSG.loading}
        />
      </div>
    );
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
          handleWidgetState={setIsSummary}
          isDecision={isDecision}
          totalPercentage={!isObjection ? yayPercentage : nayPercentage}
        />
      )}
    </div>
  );
};

StakingWidgetFlow.displayName = displayName;

export default StakingWidgetFlow;
