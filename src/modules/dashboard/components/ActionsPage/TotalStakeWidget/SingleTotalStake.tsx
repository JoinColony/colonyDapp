import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import formatNumber from 'format-number';
import { bigNumberify } from 'ethers/utils';

import Heading from '~core/Heading';
import ProgressBar from '~core/ProgressBar';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { StakeSide } from './GroupedTotalStake';
import styles from './TotalStakeWidget.css';

type Props = {
  requiredStake: string | number;
  stakeSide: string;
  totalPercentage: number;
  formattedTotalPercentage: string;
  userStake?: string | null;
  tokenDecimals?: number;
  tokenSymbol?: string;
};

const MSG = defineMessages({
  motionTitle: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.SingleTotalStake.motionTitle',
    defaultMessage: 'Stake',
  },
  objectionTitle: {
    id:
      'dashboard.ActionsPage.TotalStakeWidget.SingleTotalStake.objectionTitle',
    defaultMessage: 'Goal',
  },
  stakeProgress: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.SingleTotalStake.stakeProgress',
    defaultMessage: '{totalPercentage}% of {requiredStake}',
  },
  userStake: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.SingleTotalStake.userStake',
    defaultMessage: `You staked {userPercentage}% of this motion ({userStake}).`,
  },
});

const SingleTotalStake = ({
  userStake,
  requiredStake,
  stakeSide,
  totalPercentage,
  formattedTotalPercentage,
  tokenDecimals,
  tokenSymbol,
}: Props) => {
  const userStakePercentage = bigNumberify(userStake || 0)
    .mul(100)
    .div(requiredStake)
    .toNumber();
  const formattedUserStakePercentage = formatNumber({
    truncate: 2,
  })(userStakePercentage);

  return (
    <>
      <div className={styles.widgetHeading}>
        <Heading
          appearance={{
            theme: 'dark',
            size: 'small',
            weight: 'bold',
            margin: 'none',
          }}
          text={
            stakeSide === StakeSide.Objection
              ? MSG.objectionTitle
              : MSG.motionTitle
          }
          className={styles.title}
        />
        <span className={styles.stakeProgress}>
          <FormattedMessage
            {...MSG.stakeProgress}
            values={{
              totalPercentage: formattedTotalPercentage,
              requiredStake: (
                <Numeral
                  value={requiredStake}
                  unit={getTokenDecimalsWithFallback(tokenDecimals)}
                  suffix={tokenSymbol && ` ${tokenSymbol}`}
                  truncate={2}
                />
              ),
            }}
          />
        </span>
      </div>
      <ProgressBar
        value={totalPercentage}
        max={100}
        appearance={{
          barTheme: stakeSide === StakeSide.Objection ? 'danger' : 'primary',
          backgroundTheme: 'default',
        }}
      />
      {userStake && userStake !== '0' && (
        <p className={styles.userStake}>
          <FormattedMessage
            {...MSG.userStake}
            values={{
              userPercentage: formattedUserStakePercentage,
              userStake: (
                <Numeral
                  value={userStake}
                  unit={getTokenDecimalsWithFallback(tokenDecimals)}
                  suffix={tokenSymbol && ` ${tokenSymbol}`}
                  truncate={2}
                />
              ),
            }}
          />
        </p>
      )}
    </>
  );
};

export default SingleTotalStake;
