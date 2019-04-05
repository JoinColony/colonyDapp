/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TaskPayoutType } from '~immutable';
import type { Props as TaskClaimRewardProps } from './TaskClaimReward.jsx';

import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import StarRating from '~core/StarRating';

import styles from './TaskClaimRewardDialog.css';

const NETWORK_FEE = 0.01;

export const getTaskPayoutNetworkFee = ({ amount }: TaskPayoutType) =>
  amount * NETWORK_FEE;

export const getTaskPayoutAmountMinusNetworkFee = (payout: TaskPayoutType) =>
  payout.amount - getTaskPayoutNetworkFee(payout);

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
  networkFee: {
    id: 'dashboard.TaskClaimRewardDialog.networkFee',
    defaultMessage: '1% Network Fee',
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

type Props = {|
  cancel: () => void,
  close: () => void,
|} & TaskClaimRewardProps;

const displayName = 'dashboard.TaskClaimRewardDialog';

const TaskClaimRewardDialog = ({
  cancel,
  close,
  rating,
  reputation,
  payouts,
  title,
  lateRating,
  lateReveal,
  sortedPayouts,
  nativeTokenPayout,
}: Props) => (
  <Dialog cancel={cancel}>
    <DialogSection appearance={{ border: 'bottom' }}>
      <Heading appearance={{ size: 'medium' }} text={title} />
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
              {sortedPayouts.map(({ amount, token: { symbol } }) => (
                <Numeral
                  /*
                   * @NOTE Symbol appearance is unique, there can be only one
                   */
                  key={symbol}
                  value={amount}
                  suffix={` ${symbol}`}
                />
              ))}
            </span>
          </div>
          {/*
           * Network Fee
           */}
          <div className={styles.rewardItem}>
            <p className={styles.rewardItemDescription}>
              <FormattedMessage {...MSG.networkFee} />
            </p>
            <span className={styles.rewardItemValue}>
              {nativeTokenPayout && (
                <Numeral
                  value={nativeTokenPayout.networkFee}
                  prefix="- "
                  suffix={` ${nativeTokenPayout.symbol}`}
                />
              )}
              {sortedPayouts.map(payout => (
                <Numeral
                  /*
                   * @NOTE Symbol appearance is unique, there can be only one
                   */
                  key={payout.token.symbol}
                  value={getTaskPayoutNetworkFee(payout)}
                  prefix="- "
                  suffix={` ${payout.token.symbol}`}
                />
              ))}
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
                  value={getTaskPayoutAmountMinusNetworkFee(nativeTokenPayout)}
                  suffix={` ${nativeTokenPayout.token.symbol}`}
                />
              )}
              {sortedPayouts.map(payout => (
                <Numeral
                  /*
                   * @NOTE Symbol appearance is unique, there can be only one
                   */
                  key={payout.token.symbol}
                  value={getTaskPayoutAmountMinusNetworkFee(payout)}
                  suffix={` ${payout.token.symbol}`}
                />
              ))}
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
        text={{ id: 'button.continue' }}
        onClick={() => close()}
      />
    </DialogSection>
  </Dialog>
);

TaskClaimRewardDialog.displayName = displayName;

export default TaskClaimRewardDialog;
