import { bigNumberify } from 'ethers/utils';
import React, { useMemo, useRef } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

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
} from '~data/index';
import Tag, { Appearance as TagAppearance } from '~core/Tag';
import FriendlyName from '~core/FriendlyName';
import MemberReputation from '~core/MemberReputation';
import ProgressBar from '~core/ProgressBar';
import { getFormattedTokenValue } from '~utils/tokens';
import {
  getUpdatedDecodedMotionRoles,
  MotionState,
  MotionValue,
  MOTION_TAG_MAP,
  shouldDisplayMotion,
} from '~utils/colonyMotions';
import { useFormatRolesTitle } from '~utils/hooks/useFormatRolesTitle';

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
  colony: { domains },
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
  },
  colonyAction,
  token: { decimals, symbol },
  transactionHash,
  recipient,
  initiator,
}: Props) => {
  const bottomElementRef = useRef<HTMLInputElement>(null);
  const { passedTag, failedTag, objectionTag, ...tags } = useMemo(() => {
    return Object.values(MOTION_TAG_MAP).reduce((acc, object) => {
      const { theme, colorSchema } = object as TagAppearance;
      acc[object.tagName] = (
        <Tag text={object.name} appearance={{ theme, colorSchema }} />
      );
      return acc;
    }, {} as any);
  }, []);

  const updatedRoles = getUpdatedDecodedMotionRoles(
    colony,
    recipient,
    fromDomain,
    roles,
  );

  const motionCreatedEvent = colonyAction.events.find(
    ({ name }) => name === ColonyAndExtensionsEvents.MotionCreated,
  );
  const { motionId } = (motionCreatedEvent?.values as unknown) as MotionValue;

  const { roleMessageDescriptorId, roleTitle } = useFormatRolesTitle(
    updatedRoles,
    actionType,
    true,
  );

  const {
    username: currentUserName,
    walletAddress,
    ethereal,
  } = useLoggedInUser();

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

  const threashold = bigNumberify(
    votingStateData?.votingState?.threasholdValue || 0,
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
  const threasholdPercent = Math.round((threashold / skillRepValue) * 100);
  const domainMetadata = {
    name: domainName,
    color: domainColor,
    description: domainPurpose,
  };
  const decimalAmount = getFormattedTokenValue(amount, decimals);
  const actionAndEventValues = {
    actionType,
    fromDomain:
      (actionType === ColonyMotions.CreateDomainMotion && domainMetadata) ||
      (domains.find(
        ({ ethDomainId }) => ethDomainId === fromDomain,
      ) as OneDomain),
    toDomain: domains.find(
      ({ ethDomainId }) => ethDomainId === toDomain,
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
    passedTag: (
      <span className={motionSpecificStyles.tagWrapper}>{passedTag}</span>
    ),
    failedTag: (
      <span className={motionSpecificStyles.tagWrapper}>{failedTag}</span>
    ),
    objectionTag: (
      <span className={motionSpecificStyles.tagWrapper}>{objectionTag}</span>
    ),
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
  };

  const motionState = motionStatusData?.motionStatus;
  const motionStyles = MOTION_TAG_MAP[motionState || MotionState.Invalid];
  const isStakingPhase =
    motionState === MotionState.StakeRequired ||
    motionState === MotionState.Motion ||
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
        <div className={styles.countdownContainer}>
          <CountDownTimer
            colony={colony}
            state={motionState as MotionState}
            motionId={motionId}
          />
          {motionState === MotionState.Voting && votingStateData && (
            <>
              <span className={motionSpecificStyles.text}>
                <FormattedMessage {...MSG.or} />
              </span>
              <div className={motionSpecificStyles.progressBarContainer}>
                <ProgressBar
                  value={currentReputationPercent}
                  threshold={threasholdPercent}
                  max={100}
                  appearance={{
                    size: 'small',
                    backgroundTheme: 'dark',
                    barTheme: 'primary',
                  }}
                />
              </div>
            </>
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

          {currentUserName && !ethereal && (
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
            motionState === MotionState.FailedNoFinalizable) && (
            <FinalizeMotionAndClaimWidget
              colony={colony}
              actionType={actionType}
              motionId={motionId}
              motionDomain={motionDomain}
              scrollToRef={bottomElementRef}
              motionState={motionState}
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
