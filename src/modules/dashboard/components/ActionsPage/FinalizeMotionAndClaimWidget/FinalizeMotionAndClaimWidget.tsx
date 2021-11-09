import React, { useCallback, useMemo, RefObject } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';

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
  useDomainBalanceQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { ColonyMotions } from '~types/index';
import { mapPayload } from '~utils/actions';
import { getMainClasses } from '~utils/css';
import { MotionVote, MotionState } from '~utils/colonyMotions';

import VoteResults from './VoteResults';

import styles from './FinalizeMotionAndClaimWidget.css';

interface Props {
  colony: Colony;
  motionId: number;
  actionType: string;
  scrollToRef?: RefObject<HTMLInputElement>;
  motionState: MotionState;
  fromDomain: number;
  motionAmount: string;
  tokenAddress: string;
}

export const MSG = defineMessages({
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
      ${ColonyMotions.PaymentMotion} {Payment}
      ${ColonyMotions.CreateDomainMotion} {Create Team}
      ${ColonyMotions.EditDomainMotion} {Edit Team}
      ${ColonyMotions.ColonyEditMotion} {Colony Edit}
      ${ColonyMotions.SetUserRolesMotion} {Permission Management}
      ${ColonyMotions.MoveFundsMotion} {Move Funds}
      ${ColonyMotions.VersionUpgradeMotion} {Version Upgrade}
      ${ColonyMotions.EmitDomainReputationRewardMotion} {Award}
      other {Generic Action}
    }" be approved?`,
  },
  finalizeLabel: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.finalizeLabel',
    defaultMessage: `Finalize motion`,
  },
  finalizeTooltip: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.finalizeTooltip',
    defaultMessage: `Finalize completes a motion, allows stakes to be
    reclaimed, and if applicable, takes the action the motion was
    created to authorise.`,
  },
  finalizeButton: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.finalizeButton',
    defaultMessage: `Finalize`,
  },
  outcomeCelebration: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.outcomeCelebration',
    defaultMessage: `{outcome, select,
      true {🎉 Congratulations, your side won!}
      other {Sorry, your side lost. 😢}
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
  penaltyLabel: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.penaltyLabel',
    defaultMessage: `Penalty`,
  },
  totalLabel: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.totalLabel',
    defaultMessage: `Total`,
  },
  loading: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.loading',
    defaultMessage: 'Loading motion rewards ...',
  },
  finalizeError: {
    id: 'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.finalizeError',
    defaultMessage: `There are insufficient funds in the domain to finalize this transaction. Please add more tokens and try again.`,
  },
});

const FinalizeMotionAndClaimWidget = ({
  colony: { colonyAddress, tokens, nativeTokenAddress },
  colony,
  motionId,
  actionType,
  scrollToRef,
  motionState,
  fromDomain,
  motionAmount,
  tokenAddress,
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

  const { data: domainBalanceData } = useDomainBalanceQuery({
    variables: {
      colonyAddress,
      tokenAddress,
      domainId: fromDomain,
    },
  });

  const isFinalizable = useMemo(() => {
    const domainBalance = bigNumberify(domainBalanceData?.domainBalance || '0');

    if (
      domainBalanceData !== undefined &&
      fromDomain !== undefined &&
      motionAmount !== undefined &&
      domainBalance.lt(bigNumberify(motionAmount || '0'))
    ) {
      return false;
    }

    return true;
  }, [domainBalanceData, motionAmount, fromDomain]);

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    })),
    [walletAddress],
  );

  const handleSuccess = useCallback(() => {
    scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scrollToRef]);

  const { userStake, userWinnings, userTotals, isWinning } = useMemo(() => {
    let stake = bigNumberify(0);
    let winnings = bigNumberify(0);
    let totals = bigNumberify(0);

    if (stakerRewards?.motionStakerReward) {
      const {
        stakesYay,
        stakesNay,
        stakingRewardNay,
        stakingRewardYay,
      } = stakerRewards.motionStakerReward;
      stake = stake.add(bigNumberify(stakesYay)).add(bigNumberify(stakesNay));
      totals = totals
        .add(bigNumberify(stakingRewardYay))
        .add(bigNumberify(stakingRewardNay));
      winnings = totals.sub(stake);
    }
    return {
      userStake: moveDecimal(stake, -(nativeToken?.decimals || 0)),
      userWinnings: moveDecimal(winnings, -(nativeToken?.decimals || 0)),
      userTotals: moveDecimal(totals, -(nativeToken?.decimals || 0)),
      isWinning: winnings.gte(0),
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
  const motionNotFinalizable = motionState === MotionState.FailedNoFinalizable;
  const showFinalizeButton =
    voteResults?.motionVoteResults &&
    !finalized?.motionFinalized &&
    !motionNotFinalizable;

  const canClaimStakes =
    (bigNumberify(stakerRewards?.motionStakerReward?.stakesYay || 0).gt(0) ||
      bigNumberify(stakerRewards?.motionStakerReward?.stakesNay || 0).gt(0)) &&
    userTotals !== '0';

  const showClaimButton =
    finalized?.motionFinalized || (motionNotFinalizable && canClaimStakes);

  const yaySideWon = bigNumberify(
    voteResults?.motionVoteResults?.yayVotes || 0,
  ).gt(voteResults?.motionVoteResults?.nayVotes || 0);
  const userSideWon = yaySideWon
    ? voteResults?.motionVoteResults?.currentUserVoteSide === MotionVote.Yay
    : voteResults?.motionVoteResults?.currentUserVoteSide === MotionVote.Nay;

  return (
    <div
      className={getMainClasses({}, styles, {
        margin: showFinalizeButton || showClaimButton || hasVotes,
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
            <>
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
                    disabled={!hasRegisteredProfile || !isFinalizable}
                    onClick={() => handleSubmit()}
                    loading={isSubmitting}
                  />
                </div>
              </div>
              {!isFinalizable && (
                <div className={styles.finalizeError}>
                  <FormattedMessage {...MSG.finalizeError} />
                </div>
              )}
            </>
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
                        value={userStake}
                        suffix={` ${nativeToken?.symbol}`}
                        truncate={5}
                      />
                    </div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.label}>
                      <div>
                        <FormattedMessage
                          {...((isWinning && MSG.winningsLabel) ||
                            MSG.penaltyLabel)}
                        />
                      </div>
                    </div>
                    <div className={styles.value}>
                      <Numeral
                        value={userWinnings}
                        suffix={` ${nativeToken?.symbol}`}
                        truncate={5}
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
                        value={userTotals}
                        suffix={` ${nativeToken?.symbol}`}
                        truncate={5}
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
                  outcome: userSideWon,
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

export default FinalizeMotionAndClaimWidget;
