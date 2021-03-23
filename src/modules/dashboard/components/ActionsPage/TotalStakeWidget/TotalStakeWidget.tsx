import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import ProgressBar from '~core/ProgressBar';
import {
  useStakeAmountsForMotionQuery,
  useColonyNativeTokenQuery,
  useTokenInfoLazyQuery,
} from '~data/generated';
import { Address } from '~types/index';

import styles from './TotalStakeWidget.css';

const displayName = 'TotalStakeWidget';

type Props = {
  colonyAddress: Address;
  userAddress: Address;
  motionId: string;
};

const MSG = defineMessages({
  title: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.title',
    defaultMessage: 'Stake',
  },
  stakeProgress: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.stakeProgress',
    defaultMessage: '{totalPercentage}% of {requiredStake} {tokenSymbol}',
  },
  userStake: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.userStake',
    defaultMessage: `You staked {userPercentage}% of this motion ({userStake} {tokenSymbol}).`,
  },
});

const TotalStakeWidget = ({ colonyAddress, userAddress, motionId }: Props) => {
  const { data } = useStakeAmountsForMotionQuery({
    variables: { colonyAddress, userAddress, motionId },
  });
  const {
    totalStaked,
    userStake,
    requiredStake,
  } = data?.stakeAmountsForMotion || {
    totalStaked: 0,
    userStake: 0,
    requiredStake: 0,
  };
  const totalStakedPercentage = (totalStaked * 100) / requiredStake;
  const userStakePercentage = (userStake * 100) / requiredStake;
  const {
    data: nativeTokenAddressData,
    loading: loadingNativeTokenAddress,
  } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });
  const [
    fetchTokenInfo,
    { data: tokenInfoData, loading: loadingTokenInfoData },
  ] = useTokenInfoLazyQuery();

  useEffect(() => {
    if (nativeTokenAddressData) {
      const {
        processedColony: { nativeTokenAddress },
      } = nativeTokenAddressData;
      fetchTokenInfo({ variables: { address: nativeTokenAddress } });
    }
  }, [fetchTokenInfo, nativeTokenAddressData]);

  return (
    <div>
      <div className={styles.widgetHeading}>
        <Heading
          appearance={{
            theme: 'dark',
            size: 'small',
            weight: 'bold',
            margin: 'none',
          }}
          text={MSG.title}
        />
        <span className={styles.stakeProgress}>
          {!loadingTokenInfoData && !loadingNativeTokenAddress && (
            <FormattedMessage
              {...MSG.stakeProgress}
              values={{
                totalPercentage: totalStakedPercentage,
                requiredStake,
                tokenSymbol: tokenInfoData?.tokenInfo.symbol,
              }}
            />
          )}
        </span>
      </div>
      <ProgressBar value={totalStakedPercentage} max={100} />
      <p className={styles.userStake}>
        {!loadingTokenInfoData && !loadingNativeTokenAddress && (
          <FormattedMessage
            {...MSG.userStake}
            values={{
              userPercentage: userStakePercentage,
              userStake,
              tokenSymbol: tokenInfoData?.tokenInfo.symbol,
            }}
          />
        )}
      </p>
    </div>
  );
};

TotalStakeWidget.displayName = displayName;

export default TotalStakeWidget;
