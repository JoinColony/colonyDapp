import React, { ReactElement } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import MemberReputation from '~core/MemberReputation';
import Numeral from '~core/Numeral';
import { MiniSpinnerLoader } from '~core/Preloaders';
import TokenIcon from '~dashboard/HookedTokenIcon';

import {
  Colony,
  useLoggedInUser,
  useMotionVoterRewardQuery,
  AnyToken,
} from '~data/index';
import { getFormattedTokenValue } from '~utils/tokens';
import { MotionState } from '~utils/colonyMotions';

import styles from './VoteWidget.css';

export interface FormValues {
  vote: string;
}

interface Props {
  colony: Colony;
  motionId: number;
  buttonComponent?: ReactElement;
  showReward?: boolean;
  motionState: MotionState;
}

const MSG = defineMessages({
  votingMethodLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.votingMethodLabel',
    defaultMessage: `Voting method`,
  },
  votingMethodValue: {
    id: 'dashboard.ActionsPage.VoteWidget.votingMethodValue',
    defaultMessage: `Reputation-weighted`,
  },
  votingMethodTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.votingMethodTooltip',
    defaultMessage: `Votes are weighted by reputation in the team in which the vote is happening.`,
  },
  reputationTeamLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.reputationTeamLabel',
    defaultMessage: `Reputation in team`,
  },
  reputationTeamTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.reputationTeamTooltip',
    defaultMessage: `This is the % of the reputation you have in this team.`,
  },
  rewardLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.rewardLabel',
    defaultMessage: `Reward`,
  },
  rewardTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.rewardTooltip',
    defaultMessage: `This is the range of values between which your reward for voting will be, subject to the number of people that participate in the vote.`,
  },
  rulesLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.rulesLabel',
    defaultMessage: `Rules`,
  },
  rulesTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.rulesTooltip',
    defaultMessage: `Votes are secret and must be revealed at the end of the voting period to count.`,
  },
  loading: {
    id: 'dashboard.ActionsPage.VoteWidget.loading',
    defaultMessage: 'Loading vote details ...',
  },
});

const VoteDetails = ({
  colony: { colonyAddress, tokens, nativeTokenAddress },
  buttonComponent,
  motionId,
  showReward = true,
  motionState,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const {
    data: voterReward,
    loading: loadingVoterReward,
  } = useMotionVoterRewardQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  if (loadingVoterReward) {
    return <MiniSpinnerLoader loadingText={MSG.loading} />;
  }

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  ) as AnyToken;

  const hasRegisteredProfile = !!username && !ethereal;

  return (
    <div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.votingMethodLabel} />
          <QuestionMarkTooltip
            tooltipText={MSG.votingMethodTooltip}
            className={styles.help}
            tooltipClassName={styles.tooltip}
            tooltipPopperOptions={{
              placement: 'right',
            }}
          />
        </div>
        <div className={styles.value}>
          {/*
           * @TODO This needs to be dynamic, once we'll have more voting methods:
           * - reputation based
           * - token based
           * - hybrid
           */}
          <FormattedMessage {...MSG.votingMethodValue} />
        </div>
      </div>
      {hasRegisteredProfile && showReward && (
        <>
          <div className={styles.item}>
            <div className={styles.label}>
              <FormattedMessage {...MSG.reputationTeamLabel} />
              <QuestionMarkTooltip
                tooltipText={MSG.reputationTeamTooltip}
                className={styles.help}
                tooltipClassName={styles.tooltip}
                tooltipPopperOptions={{
                  placement: 'right',
                }}
              />
            </div>
            <div className={styles.value}>
              <div className={styles.reputation}>
                <MemberReputation
                  walletAddress={walletAddress}
                  colonyAddress={colonyAddress}
                />
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>
              <FormattedMessage {...MSG.rewardLabel} />
              <QuestionMarkTooltip
                tooltipText={MSG.rewardTooltip}
                className={styles.help}
                tooltipClassName={styles.tooltip}
                tooltipPopperOptions={{
                  placement: 'right',
                }}
              />
            </div>
            <div className={styles.value}>
              {voterReward?.motionVoterReward && (
                <>
                  {motionState === MotionState.Voting && (
                    <>
                      <TokenIcon
                        className={styles.tokenIcon}
                        token={nativeToken}
                        name={nativeToken.name || nativeToken.address}
                        size="xxs"
                      />
                      {voterReward.motionVoterReward.minReward ===
                      voterReward.motionVoterReward.maxReward ? (
                        <Numeral
                          value={getFormattedTokenValue(
                            voterReward.motionVoterReward.minReward,
                            nativeToken?.decimals,
                          )}
                          suffix={nativeToken?.symbol}
                        />
                      ) : (
                        <>
                          <Numeral
                            value={getFormattedTokenValue(
                              voterReward.motionVoterReward.minReward,
                              nativeToken?.decimals,
                            )}
                          />
                          <div className={styles.range} />
                          <Numeral
                            value={getFormattedTokenValue(
                              voterReward.motionVoterReward.maxReward,
                              nativeToken?.decimals,
                            )}
                            suffix={nativeToken?.symbol}
                          />
                        </>
                      )}
                    </>
                  )}
                  {motionState === MotionState.Reveal && (
                    <>
                      <TokenIcon
                        className={styles.tokenIcon}
                        token={nativeToken}
                        name={nativeToken.name || nativeToken.address}
                        size="xxs"
                      />
                      <Numeral
                        value={getFormattedTokenValue(
                          voterReward.motionVoterReward.reward,
                          nativeToken?.decimals,
                        )}
                        suffix={nativeToken?.symbol}
                        className={styles.reward}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
      {buttonComponent && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.rulesLabel} />
            <QuestionMarkTooltip
              tooltipText={MSG.rulesTooltip}
              className={styles.help}
              tooltipClassName={styles.tooltip}
              tooltipPopperOptions={{
                placement: 'right',
              }}
            />
          </div>
          <div className={styles.value}>{buttonComponent}</div>
        </div>
      )}
    </div>
  );
};

VoteDetails.displayName = 'dashboard.ActionsPage.VoteDetails';

export default VoteDetails;
