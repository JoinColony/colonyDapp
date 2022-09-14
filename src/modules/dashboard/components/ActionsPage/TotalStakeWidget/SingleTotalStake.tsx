import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import formatNumber from 'format-number';
import { bigNumberify } from 'ethers/utils';

import Heading from '~core/Heading';
import ProgressBar from '~core/ProgressBar';
import { Tooltip } from '~core/Popover';
import Numeral from '~core/Numeral';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { getFormattedTokenValue } from '~utils/tokens';

import styles from './TotalStakeWidget.css';

type Props = {
  requiredStake: string | number;
  isObjection: boolean;
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
  stakeToolTip: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.SingleTotalStake.stakeToolTip',
    defaultMessage: `Percentage this Motion has been staked. For it to show up in the Actions list a min 10% is required.`,
  },
  progressTooltip: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.SingleTotalStake.tooltip',
    defaultMessage: `Stake above the minimum 10% threshold to make it visible to others within the Actions list.`,
  },
});

const SingleTotalStake = ({
  userStake,
  requiredStake,
  isObjection,
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

  const requiredStakeDisplay = getFormattedTokenValue(
    requiredStake,
    tokenDecimals,
  );
  const userStakeDisplay = getFormattedTokenValue(
    userStake || 0,
    tokenDecimals,
  );

  return (
    <>
      <div className={styles.widgetHeading}>
        <span className={styles.subHeading}>
          <Heading
            appearance={{
              theme: 'dark',
              size: 'small',
              weight: 'bold',
              margin: 'none',
            }}
            text={isObjection ? MSG.objectionTitle : MSG.motionTitle}
            className={styles.title}
          />
          <QuestionMarkTooltip
            tooltipText={MSG.stakeToolTip}
            className={styles.helpTooltip}
            tooltipClassName={styles.tooltip}
            showArrow={false}
            tooltipPopperOptions={{
              placement: 'top-end',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 10],
                  },
                },
              ],
            }}
          />
        </span>
        <span className={styles.stakeProgress}>
          <FormattedMessage
            {...MSG.stakeProgress}
            values={{
              totalPercentage: formattedTotalPercentage,
              requiredStake: (
                <Numeral value={requiredStakeDisplay} suffix={tokenSymbol} />
              ),
            }}
          />
        </span>
      </div>
      {totalPercentage < 10 && (
        <Tooltip
          placement="left"
          trigger="hover"
          content={
            <div className={styles.tooltip}>
              <FormattedMessage {...MSG.progressTooltip} />
            </div>
          }
        >
          <ProgressBar
            value={totalPercentage}
            threshold={10}
            max={100}
            appearance={{
              barTheme: isObjection ? 'danger' : 'primary',
              backgroundTheme: 'default',
              size: 'normal',
            }}
            hidePercentage
          />
        </Tooltip>
      )}
      {totalPercentage >= 10 && (
        <ProgressBar
          value={totalPercentage}
          threshold={10}
          max={100}
          appearance={{
            barTheme: isObjection ? 'danger' : 'primary',
            backgroundTheme: 'default',
            size: 'normal',
          }}
          hidePercentage
        />
      )}
      {userStake && userStake !== '0' && (
        <p className={styles.userStake}>
          <FormattedMessage
            {...MSG.userStake}
            values={{
              userPercentage: formattedUserStakePercentage,
              userStake: (
                <Numeral value={userStakeDisplay} suffix={tokenSymbol} />
              ),
            }}
          />
        </p>
      )}
    </>
  );
};

export default SingleTotalStake;
