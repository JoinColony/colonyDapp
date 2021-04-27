import React, { useCallback, useMemo, RefObject } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import Numeral from '~core/Numeral';
import { MiniSpinnerLoader } from '~core/Preloaders';

import {
  Colony,
  useLoggedInUser,
  useMotionVoteResultsQuery,
  useMotionCurrentUserVotedQuery,
  useMotionFinalizedQuery,
  useMotionStakerRewardQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { ColonyMotions } from '~types/index';
import { mapPayload } from '~utils/actions';
import { getMainClasses } from '~utils/css';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import VoteResults from './VoteResults';

import styles from './FinalizeMotionAndClaimWidget.css';

interface Props {
  colony: Colony;
  motionId: number;
  actionType: string;
  motionDomain: number;
  scrollToRef?: RefObject<HTMLInputElement>;
  transactionHash: string;
}

const MSG = defineMessages({
  /*
   * @NOTE I didn't want to create a mapping for this, since they will only
   * be used in this instance
   *
   * If by chance we end up having to use this mapping elsewhere, feel free
   * to create it's own map
   */
  title: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.title',
    defaultMessage: `Should "{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint tokens}
      other {Generic Action}
    }" be approved?`,
  },
  finalizeLabel: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.finalizeLabel',
    defaultMessage: `Finalize motion`,
  },
  finalizeTooltip: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.finalizeTooltip',
    defaultMessage: `[TO BE ADDED WHEN AVAILABLE]`,
  },
  finalizeButton: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.finalizeButton',
    defaultMessage: `Finalize`,
  },
  outcomeCelebration: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.outcomeCelebration',
    defaultMessage: `{outcome, select,
      true {🎉 Congratulations, your side won!}
      other {Sorry, your side lost!}
    }`,
  },
  claimLabel: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.claimLabel',
    defaultMessage: `Claim your tokens`,
  },
  claimButton: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.claimButton',
    defaultMessage: `{claimedReward, select,
      true {Claimed}
      other {Claim}
    }`,
  },
  stakeLabel: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.stakeLabel',
    defaultMessage: `Stake`,
  },
  winningsLabel: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.winningsLabel',
    defaultMessage: `Winnings`,
  },
  totalLabel: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.totalLabel',
    defaultMessage: `Total`,
  },
  loading: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.loading',
    defaultMessage: 'Loading motion rewards ...',
  },
});

const FinalizeMotionAndClaimWidget = ({
  colony: { colonyAddress, tokens, nativeTokenAddress },
  colony,
  motionId,
  actionType,
  motionDomain = ROOT_DOMAIN_ID,
  scrollToRef,
  transactionHash,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const {
    data: voteResults,
    loading: loadingVoteResults,
  } = useMotionVoteResultsQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  const {
    data: userVoted,
    loading: loadingUserVoted,
  } = useMotionCurrentUserVotedQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  const {
    data: finalized,
    loading: loadingFinalized,
  } = useMotionFinalizedQuery({
    variables: {
      colonyAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  const {
    data: stakerRewards,
    loading: loadingStakerRewards,
  } = useMotionStakerRewardQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      userAddress: walletAddress,
      motionId,
      transactionHash,
    })),
    [walletAddress],
  );

  const handleSuccess = useCallback(() => {
    scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scrollToRef]);

  const { userStake, userWinnings, userTotals } = useMemo(() => {
    let stake = bigNumberify(0);
    let winnings;
    let totals = bigNumberify(0);
    const safeLowReward = bigNumberify(1)
      .mul(
        bigNumberify(10).pow(
          getTokenDecimalsWithFallback(nativeToken?.decimals),
        ),
      )
      .div(100);
    if (stakerRewards?.motionStakerReward) {
      const {
        stakesYay,
        stakesNay,
        stakingRewardNay,
        stakingRewardYay,
      } = stakerRewards.motionStakerReward;
      stake = stake.add(bigNumberify(stakesYay)).add(bigNumberify(stakesNay));
      if (stake.lt(safeLowReward)) {
        stake = bigNumberify(0);
      }
      totals = totals
        .add(bigNumberify(stakingRewardYay))
        .add(bigNumberify(stakingRewardNay));
      if (totals.lt(safeLowReward)) {
        totals = bigNumberify(0);
      }
      winnings = totals.sub(stake);
      if (winnings.lt(safeLowReward)) {
        winnings = bigNumberify(0);
      }
    }
    return {
      userStake: stake,
      userWinnings: winnings,
      userTotals: totals,
    };
  }, [stakerRewards, nativeToken]);

  if (
    loadingVoteResults ||
    loadingUserVoted ||
    loadingFinalized ||
    loadingStakerRewards
  ) {
    return (
      <div className={styles.main}>
        <MiniSpinnerLoader
          className={styles.loading}
          loadingText={MSG.loading}
        />
      </div>
    );
  }

  const hasRegisteredProfile = !!username && !ethereal;
  const hasVotes =
    bigNumberify(voteResults?.motionVoteResults?.nayVotes || 0).gt(0) ||
    bigNumberify(voteResults?.motionVoteResults?.yayVotes || 0).gt(0);

  /*
   * If the motion is in the Root domain, it cannot be escalated further
   * meaning it can be finalized directly
   */
  const showFinalizeButton =
    voteResults?.motionVoteResults &&
    !finalized?.motionFinalized &&
    motionDomain === ROOT_DOMAIN_ID;

  const showClaimButton = finalized?.motionFinalized;
  const canClaimStakes =
    bigNumberify(stakerRewards?.motionStakerReward?.stakesYay || 0).gt(0) ||
    bigNumberify(stakerRewards?.motionStakerReward?.stakesNay || 0).gt(0);

  return (
    <div
      className={getMainClasses({}, styles, {
        marginBottom: showFinalizeButton || false,
      })}
    >
      {showFinalizeButton && (
        <ActionForm
          initialValues={{}}
          submit={ActionTypes.COLONY_MOTION_FINALIZE}
          error={ActionTypes.COLONY_MOTION_FINALIZE_ERROR}
          success={ActionTypes.COLONY_MOTION_FINALIZE_SUCCESS}
          transform={transform}
          onSuccess={handleSuccess}
        >
          {({ handleSubmit, isSubmitting }: FormikProps<{}>) => (
            <div className={styles.itemWithForcedBorder}>
              <div className={styles.label}>
                <div>
                  <FormattedMessage {...MSG.finalizeLabel} />
                  <QuestionMarkTooltip
                    tooltipText={MSG.finalizeTooltip}
                    className={styles.help}
                    tooltipClassName={styles.tooltip}
                    tooltipPopperProps={{
                      placement: 'right',
                    }}
                  />
                </div>
              </div>
              <div className={styles.value}>
                <Button
                  appearance={{ theme: 'primary', size: 'medium' }}
                  text={MSG.finalizeButton}
                  disabled={!hasRegisteredProfile}
                  onClick={() => handleSubmit()}
                  loading={isSubmitting}
                />
              </div>
            </div>
          )}
        </ActionForm>
      )}
      {showClaimButton && (
        <ActionForm
          initialValues={{}}
          submit={ActionTypes.COLONY_MOTION_CLAIM}
          error={ActionTypes.COLONY_MOTION_CLAIM_ERROR}
          success={ActionTypes.COLONY_MOTION_CLAIM_SUCCESS}
          transform={transform}
          onSuccess={handleSuccess}
        >
          {({ handleSubmit, isSubmitting }: FormikProps<{}>) => (
            <>
              <div className={styles.title}>
                <div className={styles.label}>
                  <div>
                    <FormattedMessage {...MSG.claimLabel} />
                  </div>
                </div>
                <div className={styles.value}>
                  <Button
                    appearance={{ theme: 'primary', size: 'medium' }}
                    text={MSG.claimButton}
                    textValues={{
                      claimedReward:
                        stakerRewards?.motionStakerReward?.claimedReward,
                    }}
                    disabled={
                      !hasRegisteredProfile ||
                      !canClaimStakes ||
                      stakerRewards?.motionStakerReward?.claimedReward
                    }
                    onClick={() => handleSubmit()}
                    loading={isSubmitting}
                  />
                </div>
              </div>
              {canClaimStakes && (
                <>
                  <div className={styles.item}>
                    <div className={styles.label}>
                      <div>
                        <FormattedMessage {...MSG.stakeLabel} />
                      </div>
                    </div>
                    <div className={styles.value}>
                      <Numeral
                        unit={getTokenDecimalsWithFallback(
                          nativeToken?.decimals,
                        )}
                        value={userStake}
                        suffix={` ${nativeToken?.symbol}`}
                        truncate={2}
                      />
                    </div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.label}>
                      <div>
                        <FormattedMessage {...MSG.winningsLabel} />
                      </div>
                    </div>
                    <div className={styles.value}>
                      <Numeral
                        unit={getTokenDecimalsWithFallback(
                          nativeToken?.decimals,
                        )}
                        value={userWinnings}
                        suffix={` ${nativeToken?.symbol}`}
                        truncate={2}
                      />
                    </div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.label}>
                      <div>
                        <FormattedMessage {...MSG.totalLabel} />
                      </div>
                    </div>
                    <div className={styles.value}>
                      <Numeral
                        unit={getTokenDecimalsWithFallback(
                          nativeToken?.decimals,
                        )}
                        value={userTotals}
                        suffix={` ${nativeToken?.symbol}`}
                        truncate={2}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </ActionForm>
      )}
      <div className={styles.voteResults}>
        {hasRegisteredProfile &&
          voteResults?.motionVoteResults &&
          hasVotes &&
          userVoted?.motionCurrentUserVoted && (
            <div className={styles.outcome}>
              <FormattedMessage
                {...MSG.outcomeCelebration}
                values={{
                  outcome: !!voteResults?.motionVoteResults
                    ?.currentUserVoteSide,
                }}
              />
            </div>
          )}
        {hasVotes && (
          /*
           * @NOTE If we have votes **AND** we're in a finalizable state (this is checked on the action page)
           * then we are in a VOTING flow that needs to be finalized.
           * Othewise, we're in a STAKING flow that needs to be finalized.
           */
          <>
            <Heading
              text={MSG.title}
              textValues={{ actionType }}
              appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
            />
            <VoteResults
              /*
               * @NOTE We are not passing down the `motionVoteResults` values
               * since the `VoteResults` component is designed to work independent
               * of this widget (since we'll need to use it in a system message)
               */
              colony={colony}
              motionId={motionId}
            />
          </>
        )}
      </div>
    </div>
  );
};

FinalizeMotionAndClaimWidget.displayName =
  'dashboard.ActionsPage.FinalizeMotionAndClaimWidget';

export default FinalizeMotionAndClaimWidget;
