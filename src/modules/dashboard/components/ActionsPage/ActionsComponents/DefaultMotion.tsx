import React, { useMemo, useRef, useCallback } from 'react';
import { bigNumberify } from 'ethers/utils';
import { FormattedMessage, defineMessages } from 'react-intl';
import classnames from 'classnames';
import Decimal from 'decimal.js';

import { ROOT_DOMAIN_ID, ColonyRoles } from '@colony/colony-js';
import Heading from '~core/Heading';
import ActionsPageFeed, {
  ActionsPageFeedItemWithIPFS,
  SystemMessage,
} from '~dashboard/ActionsPageFeed';
import ActionsPageComment from '~dashboard/ActionsPageComment';
import { ColonyMotions, ColonyAndExtensionsEvents } from '~types/index';
import {
  useLoggedInUser,
  Colony,
  ColonyActionQuery,
  TokenInfoQuery,
  AnyUser,
  useMotionsSystemMessagesQuery,
  useEventsForMotionQuery,
  useMotionObjectionAnnotationQuery,
  useStakeAmountsForMotionQuery,
  useUser,
  useVotingStateQuery,
  useMotionStatusQuery,
  OneDomain,
  useColonyHistoricRolesQuery,
} from '~data/index';
import Tag, { Appearance as TagAppearance } from '~core/Tag';
import FriendlyName from '~core/FriendlyName';
import MemberReputation from '~core/MemberReputation';
import ProgressBar from '~core/ProgressBar';
import { ActionButton } from '~core/Button';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { getFormattedTokenValue } from '~utils/tokens';
import {
  getUpdatedDecodedMotionRoles,
  MotionState,
  MotionValue,
  MOTION_TAG_MAP,
  shouldDisplayMotion,
} from '~utils/colonyMotions';
import { useFormatRolesTitle } from '~utils/hooks/useFormatRolesTitle';
import { mapPayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';

import DetailsWidget from '../DetailsWidget';
import StakingWidgetFlow from '../StakingWidget';
import VoteWidget from '../VoteWidget';
import RevealWidget from '../RevealWidget';
import StakeRequiredBanner from '../StakeRequiredBanner';
import FinalizeMotionAndClaimWidget, {
  MSG as voteResultsMSG,
} from '../FinalizeMotionAndClaimWidget';
import VoteResults from '../FinalizeMotionAndClaimWidget/VoteResults';
import CountDownTimer from '../CountDownTimer';

import styles from './DefaultAction.css';
import motionSpecificStyles from './DefaultMotion.css';

const MSG = defineMessages({
  or: {
    id: 'dashboard.ActionsPage.DefaultMotion.or',
    defaultMessage: `OR`,
  },
  escalate: {
    id: 'dashboard.ActionsPage.DefaultMotion.escalate',
    defaultMessage: `Escalate`,
  },
  escalateTooltip: {
    id: 'dashboard.ActionsPage.DefaultMotion.escalateTooltip',
    defaultMessage: `Motion escalation will be released in a future update`,
  },
  votingProgressBarTooltip: {
    id: 'dashboard.ActionsPage.DefaultMotion.votingProgressBarTooltip',
    defaultMessage: `Voting ends at the sooner of either time-out, or the reputation threshold being reached.`,
  },
});

const displayName = 'dashboard.ActionsPage.DefaultMotion';

interface Props {
  colony: Colony;
  colonyAction: ColonyActionQuery['colonyAction'];
  token: TokenInfoQuery['tokenInfo'];
  transactionHash: string;
  recipient: AnyUser;
  initiator: AnyUser;
}

const DefaultMotion = ({
  colony: { domains, colonyAddress },
  colony,
  colonyAction: {
    events = [],
    actionType,
    annotationHash,
    colonyDisplayName,
    amount,
    motionDomain,
    actionInitiator,
    rootHash,
    domainName,
    domainColor,
    domainPurpose,
    roles,
    fromDomain,
    toDomain,
    blockNumber,
    newVersion,
    tokenAddress,
    reputationChange,
  },
  colonyAction,
  token: { decimals, symbol },
  transactionHash,
  recipient,
  initiator,
}: Props) => {
  const bottomElementRef = useRef<HTMLInputElement>(null);
  const {
    passedTag,
    failedTag,
    objectionTag,
    escalateTag,
    ...tags
  } = useMemo(() => {
    return Object.values(MOTION_TAG_MAP).reduce((acc, object) => {
      const { theme, colorSchema } = object as TagAppearance;
      acc[object.tagName] = (
        <Tag text={object.name} appearance={{ theme, colorSchema }} />
      );
      return acc;
    }, {} as any);
  }, []);

  const motionCreatedEvent = colonyAction.events.find(
    ({ name }) => name === ColonyAndExtensionsEvents.MotionCreated,
  );
  const { motionId } = (motionCreatedEvent?.values as unknown) as MotionValue;

  const {
    username: currentUserName,
    walletAddress,
    ethereal,
  } = useLoggedInUser();
  const userHasProfile = currentUserName && !ethereal;

  const { data: motionsSystemMessagesData } = useMotionsSystemMessagesQuery({
    variables: {
      motionId,
      colonyAddress: colony.colonyAddress,
    },
    fetchPolicy: 'network-only',
  });
  const { data: motionEventsData } = useEventsForMotionQuery({
    variables: { colonyAddress: colony.colonyAddress, motionId },
    fetchPolicy: 'network-only',
  });

  const { data: motionStakeData } = useStakeAmountsForMotionQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
  });

  const { data: motionStatusData } = useMotionStatusQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  const { data: historicColonyRoles } = useColonyHistoricRolesQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
      blockNumber,
    },
  });

  const escalateTransform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      motionId,
      userAddress: walletAddress,
    })),
    [],
  );

  const updatedRoles = getUpdatedDecodedMotionRoles(
    recipient,
    fromDomain,
    (historicColonyRoles?.historicColonyRoles as unknown) as ColonyRoles,
    roles,
  );

  const { roleMessageDescriptorId, roleTitle } = useFormatRolesTitle(
    updatedRoles,
    actionType,
    true,
  );

  const requiredStake = bigNumberify(
    motionStakeData?.stakeAmountsForMotion?.requiredStake || 0,
  ).toString();
  const totalNayStake = bigNumberify(
    motionStakeData?.stakeAmountsForMotion?.totalStaked.NAY || 0,
  );
  const totalYayStake = bigNumberify(
    motionStakeData?.stakeAmountsForMotion?.totalStaked.YAY || 0,
  );
  const currentStake = totalNayStake.add(totalYayStake).toString();
  const isFullyNayStaked = totalNayStake.gte(requiredStake);

  const { data: objectionAnnotation } = useMotionObjectionAnnotationQuery({
    variables: {
      motionId,
      colonyAddress: colony.colonyAddress,
    },
    fetchPolicy: 'network-only',
  });

  const { data: votingStateData } = useVotingStateQuery({
    variables: { colonyAddress: colony.colonyAddress, motionId },
    fetchPolicy: 'network-only',
  });

  const threshold = bigNumberify(
    votingStateData?.votingState?.thresholdValue || 0,
  )
    .div(bigNumberify(10).pow(18))
    .toNumber();
  const totalVotedReputationValue = bigNumberify(
    votingStateData?.votingState?.totalVotedReputation || 0,
  )
    .div(bigNumberify(10).pow(18))
    .toNumber();

  const skillRepValue = bigNumberify(
    votingStateData?.votingState?.skillRep || 0,
  )
    .div(bigNumberify(10).pow(18))
    .toNumber();

  const currentReputationPercent =
    (totalVotedReputationValue > 0 &&
      Math.round((totalVotedReputationValue / skillRepValue) * 100)) ||
    0;
  const thresholdPercent = Math.round((threshold / skillRepValue) * 100);
  const domainMetadata = {
    name: domainName,
    color: domainColor,
    description: domainPurpose,
  };
  const decimalAmount = getFormattedTokenValue(amount, decimals);
  const actionAndEventValues = {
    actionType,
    newVersion,
    fromDomain:
      (actionType === ColonyMotions.CreateDomainMotion && domainMetadata) ||
      (domains.find(
        ({ ethDomainId }) => ethDomainId === fromDomain,
      ) as OneDomain),
    toDomain: domains.find(
      ({ ethDomainId }) => ethDomainId === toDomain,
    ) as OneDomain,
    motionDomain: domains.find(
      ({ ethDomainId }) => ethDomainId === motionDomain,
    ) as OneDomain,
    roles: updatedRoles,
    recipient: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={recipient} autoShrinkAddress colony={colony} />
      </span>
    ),
    amount: decimalAmount,
    tokenSymbol: <span>{symbol || '???'}</span>,
    initiator: (
      <>
        <span className={styles.titleDecoration}>
          <FriendlyName user={initiator} autoShrinkAddress />
        </span>
        <div className={motionSpecificStyles.reputation}>
          <MemberReputation
            walletAddress={actionInitiator}
            colonyAddress={colony.colonyAddress}
            rootHash={rootHash || undefined}
          />
        </div>
      </>
    ),
    colonyName: (
      <FriendlyName
        colony={{
          ...colony,
          ...(colonyDisplayName ? { displayName: colonyDisplayName } : {}),
        }}
        autoShrinkAddress
      />
    ),
    passedTag,
    failedTag,
    objectionTag,
    escalateTag,
    ...tags,
    voteResultsWidget: (
      <div className={motionSpecificStyles.voteResultsWrapper}>
        <Heading
          text={voteResultsMSG.title}
          textValues={{ actionType }}
          appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
        />
        <VoteResults colony={colony} motionId={motionId} />
      </div>
    ),
    spaceBreak: <br />,
    reputationChange: `${getFormattedTokenValue(
      new Decimal(reputationChange).abs().toString(),
      decimals,
    )} pts`,
    isSmiteAction: new Decimal(reputationChange).isNegative(),
  };

  const motionState = motionStatusData?.motionStatus;
  const motionStyles = MOTION_TAG_MAP[motionState || MotionState.Invalid];
  const isStakingPhase =
    motionState === MotionState.Staking ||
    motionState === MotionState.Staked ||
    motionState === MotionState.Objection;

  const objectionAnnotationUser = useUser(
    objectionAnnotation?.motionObjectionAnnotation?.address || '',
  );

  return (
    <div className={styles.main}>
      <StakeRequiredBanner
        stakeRequired={!shouldDisplayMotion(currentStake, requiredStake)}
      />
      <div className={styles.upperContainer}>
        {motionState && (
          <p className={styles.tagWrapper}>
            <Tag
              text={motionStyles.name}
              appearance={{
                theme: motionStyles.theme,
                colorSchema: motionStyles.colorSchema,
              }}
            />
          </p>
        )}
        <div
          className={classnames(styles.countdownContainer, {
            [styles.votingCountdownContainer]:
              motionState === MotionState.Voting && votingStateData,
          })}
        >
          <CountDownTimer
            colony={colony}
            state={motionState as MotionState}
            motionId={motionId}
            isFullyNayStaked={isFullyNayStaked}
          />
          {motionState === MotionState.Voting && votingStateData && (
            <div className={motionSpecificStyles.progressStateContainer}>
              <span className={motionSpecificStyles.text}>
                <FormattedMessage {...MSG.or} />
              </span>
              <div className={motionSpecificStyles.progressBarContainer}>
                <ProgressBar
                  value={currentReputationPercent}
                  threshold={thresholdPercent}
                  max={100}
                  appearance={{
                    size: 'small',
                    backgroundTheme: 'dark',
                    barTheme: 'primary',
                    borderRadius: 'small',
                  }}
                />
              </div>
              <QuestionMarkTooltip
                tooltipText={MSG.votingProgressBarTooltip}
                className={motionSpecificStyles.helpProgressBar}
                tooltipClassName={motionSpecificStyles.tooltip}
                showArrow={false}
                tooltipPopperProps={{
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
            </div>
          )}
          {motionState === MotionState.Escalation &&
            motionDomain !== ROOT_DOMAIN_ID &&
            userHasProfile && (
              <div className={motionSpecificStyles.escalation}>
                <ActionButton
                  appearance={{ theme: 'blue', size: 'small' }}
                  submit={ActionTypes.COLONY_MOTION_ESCALATE}
                  error={ActionTypes.COLONY_MOTION_ESCALATE_ERROR}
                  success={ActionTypes.COLONY_MOTION_ESCALATE_SUCCESS}
                  transform={escalateTransform}
                  text={MSG.escalate}
                  /*
                   * @NOTE For the current release the "escalate" functionality
                   * has been disabled due to difficulties in implementing
                   * the events, **after** the motion has been escalated, due
                   * to the `motion.events` array values being reset
                   */
                  disabled
                />
                <QuestionMarkTooltip
                  tooltipText={MSG.escalateTooltip}
                  className={motionSpecificStyles.helpEscalate}
                  tooltipClassName={motionSpecificStyles.tooltip}
                  tooltipPopperProps={{
                    placement: 'right',
                  }}
                />
              </div>
            )}
        </div>
      </div>
      <hr className={styles.dividerTop} />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            <FormattedMessage
              id={roleMessageDescriptorId || 'motion.title'}
              values={{
                ...actionAndEventValues,
                fromDomainName: actionAndEventValues.fromDomain?.name,
                toDomainName: actionAndEventValues.toDomain?.name,
                roles: roleTitle,
              }}
            />
          </h1>
          {annotationHash && (
            <div className={motionSpecificStyles.annotation}>
              <ActionsPageFeedItemWithIPFS
                user={initiator}
                annotation
                hash={annotationHash}
              />
            </div>
          )}
          {objectionAnnotation?.motionObjectionAnnotation?.metadata && (
            <ActionsPageFeedItemWithIPFS
              user={objectionAnnotationUser}
              annotation
              hash={objectionAnnotation.motionObjectionAnnotation.metadata}
              appearance={{ theme: 'danger' }}
            />
          )}
          <ActionsPageFeed
            actionType={actionType}
            transactionHash={transactionHash as string}
            networkEvents={[
              ...events,
              ...(motionEventsData?.eventsForMotion || []),
            ]}
            systemMessages={
              // eslint-disable-next-line max-len
              motionsSystemMessagesData?.motionsSystemMessages as SystemMessage[]
            }
            values={actionAndEventValues}
            actionData={colonyAction}
            colony={colony}
            rootHash={rootHash || undefined}
          />

          {userHasProfile && (
            <div ref={bottomElementRef}>
              <ActionsPageComment
                transactionHash={transactionHash}
                colonyAddress={colony.colonyAddress}
              />
            </div>
          )}
        </div>
        <div className={styles.details}>
          {isStakingPhase && (
            <StakingWidgetFlow
              motionId={motionId}
              colony={colony}
              scrollToRef={bottomElementRef}
            />
          )}
          {motionState === MotionState.Voting && (
            <VoteWidget
              colony={colony}
              actionType={actionType}
              motionId={motionId}
              motionDomain={motionDomain}
              scrollToRef={bottomElementRef}
              motionState={motionState}
            />
          )}
          {motionState === MotionState.Reveal && (
            <RevealWidget
              colony={colony}
              motionId={motionId}
              scrollToRef={bottomElementRef}
              motionState={motionState}
            />
          )}
          {(motionState === MotionState.Failed ||
            motionState === MotionState.Passed ||
            motionState === MotionState.Escalation ||
            motionState === MotionState.FailedNoFinalizable) && (
            <FinalizeMotionAndClaimWidget
              colony={colony}
              actionType={actionType}
              motionId={motionId}
              scrollToRef={bottomElementRef}
              motionState={motionState}
              fromDomain={fromDomain}
              motionAmount={amount}
              tokenAddress={tokenAddress}
            />
          )}
          <DetailsWidget
            actionType={actionType as ColonyMotions}
            recipient={recipient}
            transactionHash={transactionHash}
            values={{
              ...actionAndEventValues,
              fromDomain:
                actionType === ColonyMotions.EditDomainMotion
                  ? domainMetadata
                  : actionAndEventValues.fromDomain,
            }}
            colony={colony}
          />
        </div>
      </div>
    </div>
  );
};

DefaultMotion.displayName = displayName;

export default DefaultMotion;
