import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import formatNumber from 'format-number';
import { bigNumberify } from 'ethers/utils';

import Heading from '~core/Heading';
import ProgressBar from '~core/ProgressBar';
import Numeral from '~core/Numeral';
import { useLoggedInUser } from '~data/index';
import {
  useStakeAmountsForMotionQuery,
  useColonyNativeTokenQuery,
  useTokenInfoLazyQuery,
} from '~data/generated';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './TotalStakeWidget.css';

const displayName = 'TotalStakeWidget';

type Props = {
  colonyAddress: Address;
  motionId: number;
  isObjectionStake?: boolean;
};

const MSG = defineMessages({
  motionTitle: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.motionTitle',
    defaultMessage: 'Stake',
  },
  objectionTitle: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.objectionTitle',
    defaultMessage: 'Goal',
  },
  stakeProgress: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.stakeProgress',
    defaultMessage: '{totalPercentage} of {requiredStake}',
  },
  userStake: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.userStake',
    defaultMessage: `You staked {userPercentage} of this motion ({userStake}).`,
  },
});

const TotalStakeWidget = ({
  colonyAddress,
  motionId,
  isObjectionStake = false,
}: Props) => {
  const { walletAddress } = useLoggedInUser();
  const { data, loading } = useStakeAmountsForMotionQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
      isObjectionStake,
    },
  });
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

  if (loading || !data?.stakeAmountsForMotion) {
    return null;
  }

  const { totalStaked, userStake, requiredStake } = data.stakeAmountsForMotion;
  const divisibleRequiredStake = !bigNumberify(requiredStake).isZero()
    ? requiredStake
    : 1;
  const bigNumberUserStake = bigNumberify(userStake);
  const totalStakedPercentage = bigNumberify(totalStaked)
    .mul(100)
    .div(divisibleRequiredStake)
    .toNumber();
  const userStakePercentage = bigNumberUserStake
    .mul(100)
    .div(divisibleRequiredStake)
    .toNumber();
  const formattedTotalStakedPercentage = formatNumber({
    truncate: 2,
  })(totalStakedPercentage);
  const formattedUserStakePercentage = formatNumber({
    truncate: 2,
  })(userStakePercentage);

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeading}>
        <Heading
          appearance={{
            theme: 'dark',
            size: 'small',
            weight: 'bold',
            margin: 'none',
          }}
          text={isObjectionStake ? MSG.objectionTitle : MSG.motionTitle}
          className={styles.title}
        />
        <span className={styles.stakeProgress}>
          {!loadingTokenInfoData && !loadingNativeTokenAddress && (
            <FormattedMessage
              {...MSG.stakeProgress}
              values={{
                totalPercentage: formattedTotalStakedPercentage,
                requiredStake: (
                  <Numeral
                    value={requiredStake}
                    unit={getTokenDecimalsWithFallback(
                      tokenInfoData?.tokenInfo.decimals,
                    )}
                    suffix={` ${tokenInfoData?.tokenInfo.symbol}`}
                  />
                ),
              }}
            />
          )}
        </span>
      </div>
      <ProgressBar
        value={totalStakedPercentage}
        max={100}
        appearance={{
          barTheme: isObjectionStake ? 'danger' : 'primary',
          backgroundTheme: 'default',
        }}
      />
      {!bigNumberUserStake.isZero() && (
        <p className={styles.userStake}>
          {!loadingTokenInfoData && !loadingNativeTokenAddress && (
            <FormattedMessage
              {...MSG.userStake}
              values={{
                userPercentage: formattedUserStakePercentage,
                userStake: (
                  <Numeral
                    value={userStake}
                    unit={getTokenDecimalsWithFallback(
                      tokenInfoData?.tokenInfo.decimals,
                    )}
                    suffix={` ${tokenInfoData?.tokenInfo.symbol}`}
                  />
                ),
              }}
            />
          )}
        </p>
      )}
    </div>
  );
};

TotalStakeWidget.displayName = displayName;

export default TotalStakeWidget;
