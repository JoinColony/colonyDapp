import React, { ReactElement } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import MemberReputation from '~core/MemberReputation';
import Numeral from '~core/Numeral';
import Icon from '~core/Icon';

import {
  Colony,
  useLoggedInUser,
  useMotionVoterRewardQuery,
} from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
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
    defaultMessage: `Colony makes it possible to utilize different voting methods. Selected voting method depends on installed extensions. You can change voting method in Governance Policy.`,
  },
  reputationTeamLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.reputationTeamLabel',
    defaultMessage: `Reputation in team`,
  },
  reputationTeamTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.reputationTeamTooltip',
    defaultMessage: `Displays users own reputation in a domain. For example, for reputation 3.5%, user vote is going to be counted as 3.5. Users without reputation, couldn’t vote.`,
  },
  rewardLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.rewardLabel',
    defaultMessage: `Reward`,
  },
  rewardTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.rewardTooltip',
    defaultMessage: `Displays possible reward range for an individual user. If prediction aligns with the winning outcome, then user receives reward. Final value depends on [TO BE ADDED]`,
  },
  rulesLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.rulesLabel',
    defaultMessage: `Rules`,
  },
  rulesTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.rulesTooltip',
    defaultMessage: `Voting process goes in stages. User selects option to vote upon. Then reveals the own vote before the ‘Reveal’ stage passes. Later on, user has to claim tokens and finalize transaction.`,
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

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const hasRegisteredProfile = !!username && !ethereal;

  return (
    <div>
      <div className={styles.item}>
        <div className={styles.label}>
          <div>
            <FormattedMessage {...MSG.votingMethodLabel} />
            <QuestionMarkTooltip
              tooltipText={MSG.votingMethodTooltip}
              className={styles.help}
              tooltipClassName={styles.tooltip}
              tooltipPopperProps={{
                placement: 'right',
              }}
            />
          </div>
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
              <div>
                <FormattedMessage {...MSG.reputationTeamLabel} />
                <QuestionMarkTooltip
                  tooltipText={MSG.reputationTeamTooltip}
                  className={styles.help}
                  tooltipClassName={styles.tooltip}
                  tooltipPopperProps={{
                    placement: 'right',
                  }}
                />
              </div>
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
              <div>
                <FormattedMessage {...MSG.rewardLabel} />
                <QuestionMarkTooltip
                  tooltipText={MSG.rewardTooltip}
                  className={styles.help}
                  tooltipClassName={styles.tooltip}
                  tooltipPopperProps={{
                    placement: 'right',
                  }}
                />
              </div>
            </div>
            <div className={styles.value}>
              {voterReward?.motionVoterReward && !loadingVoterReward && (
                <>
                  {motionState === MotionState.Voting && (
                    <>
                      <Icon
                        name="clny-token"
                        title="clny"
                        appearance={{ size: 'tiny' }}
                      />
                      <Numeral
                        unit={getTokenDecimalsWithFallback(
                          nativeToken?.decimals,
                        )}
                        value={voterReward.motionVoterReward.minReward}
                        appearance={{ theme: 'darken', size: 'small' }}
                        truncate={5}
                      />
                      <div className={styles.range} />
                      <Numeral
                        unit={getTokenDecimalsWithFallback(
                          nativeToken?.decimals,
                        )}
                        value={voterReward.motionVoterReward.maxReward}
                        appearance={{ theme: 'darken', size: 'small' }}
                        truncate={5}
                        suffix={` ${nativeToken?.symbol}`}
                      />
                    </>
                  )}
                  {motionState === MotionState.Reveal && (
                    <>
                      <Icon
                        name="clny-token"
                        title="clny"
                        appearance={{ size: 'tiny' }}
                      />
                      <Numeral
                        unit={getTokenDecimalsWithFallback(
                          nativeToken?.decimals,
                        )}
                        value={voterReward.motionVoterReward.reward}
                        suffix={` ${nativeToken?.symbol}`}
                        appearance={{ theme: 'darken', size: 'small' }}
                        truncate={5}
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
            <div>
              <FormattedMessage {...MSG.rulesLabel} />
              <QuestionMarkTooltip
                tooltipText={MSG.rulesTooltip}
                className={styles.help}
                tooltipClassName={styles.tooltip}
                tooltipPopperProps={{
                  placement: 'right',
                }}
              />
            </div>
          </div>
          <div className={styles.value}>{buttonComponent}</div>
        </div>
      )}
    </div>
  );
};

VoteDetails.displayName = 'dashboard.ActionsPage.VoteDetails';

export default VoteDetails;
