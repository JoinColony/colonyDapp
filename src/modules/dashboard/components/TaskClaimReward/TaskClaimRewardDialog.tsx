import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import StarRating from '~core/StarRating';
import { useSelector } from '~utils/hooks';
import { Payouts } from '~data/index';

import { networkFeeSelector } from '../../../core/selectors';
import { Props as TaskClaimRewardProps } from './TaskClaimReward';

import styles from './TaskClaimRewardDialog.css';

export const getTaskPayoutNetworkFee = (
  { amount }: Payouts[0],
  fee: number,
  // @ts-ignore (apparently this is a BigNumber? is the type wrong?)
) => amount * fee;

export const getTaskPayoutAmountMinusNetworkFee = (
  payout: Payouts[0],
  fee: number,
  // @ts-ignore (apparently this is a BigNumber? is the type wrong?)
) => payout.amount - getTaskPayoutNetworkFee(payout, fee);

const MSG = defineMessages({
  yourRating: {
    id: 'dashboard.TaskClaimRewardDialog.yourRating',
    defaultMessage: 'You were rated',
  },
  yourReputation: {
    id: 'dashboard.TaskClaimRewardDialog.yourReputation',
    defaultMessage: 'Your earned reputation',
  },
  reputationDetails: {
    id: 'dashboard.TaskClaimRewardDialog.reputationDetails',
    defaultMessage: `{rating, select,
      3 {You earned a 1.5x reputation bonus!}
      1 {Your received a reputation penalty for a 1 star rating.}
    }`,
  },
  reputationPenalty: {
    id: 'dashboard.TaskClaimRewardDialog.reputationPenalty',
    defaultMessage: `You were penalized for not {lateRating, select,
      true {rating}
      other {revealing}
    } on time.`,
  },
  claimReward: {
    id: 'dashboard.TaskClaimRewardDialog.claimReward',
    defaultMessage: 'Claim Your Rewards',
  },
  yourReward: {
    id: 'dashboard.TaskClaimRewardDialog.yourReward',
    defaultMessage: 'Your Reward',
  },
  networkError: {
    id: 'dashboard.TaskClaimRewardDialog.networkError',
    defaultMessage: 'There was an error with the network. Try again.',
  },
  networkFee: {
    id: 'dashboard.TaskClaimRewardDialog.networkFee',
    defaultMessage: '{percentage} Network Fee',
  },
  total: {
    id: 'dashboard.TaskClaimRewardDialog.total',
    defaultMessage: 'Total',
  },
  noRewardsTitle: {
    id: 'dashboard.TaskClaimRewardDialog.noRewardsTitle',
    defaultMessage: 'What does it mean?',
  },
  noRewardsDescription: {
    id: 'dashboard.TaskClaimRewardDialog.noRewardsDescription',
    defaultMessage: `
      You have been rated {oneStarRating}. This means you have failed to submit
      work that meets the task requirements. You will not receive any tokens
      and your reputation has been penalized.
    `,
  },
  oneStarRating: {
    id: 'dashboard.TaskClaimRewardDialog.oneStarRating',
    defaultMessage: 'one star',
  },
});

interface Props extends TaskClaimRewardProps {
  cancel: () => void;
  close: () => void;
}

const displayName = 'dashboard.TaskClaimRewardDialog';

const TaskClaimRewardDialog = ({
  cancel,
  close,
  task: {
    /* colonyAddress, */
    /* reputation, */
    /* payouts, */
    title,
    // @ts-ignore
    rating,
    // @ts-ignore
    lateRating,
    // @ts-ignore
    lateReveal,
    // @ts-ignore
    sortedPayouts,
    // @ts-ignore
    nativeTokenPayout,
  },
}: Props) => {
  const networkFee = useSelector(networkFeeSelector);
  // @TODO This component is unused. Get token options if needbe
  const payouts = [];
  const reputation = 0;
  const tokenOptions = [];
  const getToken = useCallback(
    (tokenAddress: Address) =>
      (tokenOptions &&
        tokenOptions.find(({ address }) => address === tokenAddress)) || {
        symbol: '',
      },
    [tokenOptions],
  );
  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ border: 'bottom' }}>
        {title && <Heading appearance={{ size: 'medium' }} text={title} />}
        <section className={styles.starRating}>
          <p className={styles.starRatingDescription}>
            <FormattedMessage {...MSG.yourRating} />
          </p>
          <div className={styles.stars}>
            <StarRating rating={rating} />
          </div>
        </section>
        {nativeTokenPayout && (
          <section className={styles.earnedReputation}>
            <p className={styles.starRatingDescription}>
              <FormattedMessage {...MSG.yourReputation} />
              {rating === 3 && (
                <span className={styles.earnedReputationDetails}>
                  <FormattedMessage
                    {...MSG.reputationDetails}
                    values={{ rating }}
                  />
                </span>
              )}
              {rating === 1 && (
                <p className={styles.earnedReputationPenalty}>
                  <FormattedMessage
                    {...MSG.reputationDetails}
                    values={{ rating }}
                  />
                </p>
              )}
              {(lateRating || lateReveal) && (
                <p className={styles.earnedReputationPenalty}>
                  <FormattedMessage
                    {...MSG.reputationPenalty}
                    values={{ lateRating }}
                  />
                </p>
              )}
            </p>
            <div className={styles.reputationValue}>
              <Numeral
                value={reputation}
                prefix={rating === 1 ? '- ' : ''}
                suffix=" REP"
              />
            </div>
          </section>
        )}
      </DialogSection>
      {rating > 1 && payouts.length ? (
        <DialogSection>
          <Heading appearance={{ size: 'medium' }} text={MSG.claimReward} />
          <section className={styles.rewards}>
            {/*
             * Rewards
             */}
            <div className={styles.rewardItem}>
              <p className={styles.rewardItemDescription}>
                <FormattedMessage {...MSG.yourReward} />
              </p>
              <span className={styles.rewardItemValue}>
                {nativeTokenPayout && (
                  <Numeral
                    value={nativeTokenPayout.amount}
                    suffix={` ${nativeTokenPayout.symbol}`}
                  />
                )}
                {sortedPayouts.map(({ amount, token }) => {
                  const { symbol } = getToken(token);
                  return (
                    <Numeral key={token} value={amount} suffix={` ${symbol}`} />
                  );
                })}
              </span>
            </div>
            {/*
             * Network Fee
             */}
            <div className={styles.rewardItem}>
              <p className={styles.rewardItemDescription}>
                <FormattedMessage
                  {...MSG.networkFee}
                  values={{
                    percentage: (
                      <Numeral
                        value={networkFee * 1e2}
                        suffix="%"
                        truncate={1}
                      />
                    ),
                  }}
                />
              </p>
              <span className={styles.rewardItemValue}>
                {nativeTokenPayout && (
                  <Numeral
                    value={nativeTokenPayout.networkFee}
                    prefix="- "
                    suffix={` ${nativeTokenPayout.symbol}`}
                  />
                )}
                {sortedPayouts.map(payout => {
                  const { symbol } = getToken(payout.token);
                  return (
                    <Numeral
                      key={payout.token}
                      value={getTaskPayoutNetworkFee(payout, networkFee)}
                      prefix="- "
                      suffix={` ${symbol}`}
                    />
                  );
                })}
              </span>
            </div>
            {/*
             * Totals
             */}
            <div className={styles.total}>
              <p className={styles.rewardItemDescription}>
                <FormattedMessage {...MSG.total} />
              </p>
              <span className={styles.rewardItemValue}>
                {nativeTokenPayout && (
                  <Numeral
                    value={getTaskPayoutAmountMinusNetworkFee(
                      nativeTokenPayout,
                      networkFee,
                    )}
                    suffix={` ${nativeTokenPayout.token.symbol}`}
                  />
                )}
                {sortedPayouts.map(payout => {
                  const { symbol } = getToken(payout.token);
                  return (
                    <Numeral
                      key={payout.token}
                      value={getTaskPayoutAmountMinusNetworkFee(
                        payout,
                        networkFee,
                      )}
                      suffix={` ${symbol}`}
                    />
                  );
                })}
              </span>
            </div>
          </section>
        </DialogSection>
      ) : (
        <DialogSection>
          <Heading appearance={{ size: 'medium' }} text={MSG.noRewardsTitle} />
          <FormattedMessage
            {...MSG.noRewardsDescription}
            values={{
              oneStarRating: (
                <span className={styles.oneStarRating}>
                  <FormattedMessage {...MSG.oneStarRating} />
                </span>
              ),
            }}
          />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          text={{ id: 'button.cancel' }}
          onClick={() => cancel()}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => close()}
          text={{ id: 'button.continue' }}
        />
      </DialogSection>
    </Dialog>
  );
};

TaskClaimRewardDialog.displayName = displayName;

export default TaskClaimRewardDialog;
