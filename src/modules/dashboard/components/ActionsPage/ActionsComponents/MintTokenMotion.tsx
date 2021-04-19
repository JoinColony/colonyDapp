import React, { useMemo } from 'react';

import { FormattedMessage } from 'react-intl';

import Numeral from '~core/Numeral';
import ActionsPageFeed, {
  ActionsPageFeedItem,
  SystemMessage,
} from '~dashboard/ActionsPageFeed';
import { ColonyMotions, ColonyAndExtensionsEvents } from '~types/index';
import {
  Colony,
  ColonyActionQuery,
  TokenInfoQuery,
  AnyUser,
  useMotionsSystemMessagesQuery,
  useEventsForMotionQuery,
} from '~data/index';
import Tag, { Appearance as TagAppearance } from '~core/Tag';
import FriendlyName from '~core/FriendlyName';
import MemberReputation from '~core/MemberReputation';
import CountDownTimer from '~core/CountDownTimer';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { MotionState, MOTION_TAG_MAP } from '~utils/colonyMotions';

import DetailsWidget from '../DetailsWidget';
import StakingWidget from '../StakingWidget';
import VoteWidget from '../VoteWidget';
import RevealWidget from '../RevealWidget';
import FinalizeMotionWidget from '../FinalizeMotionWidget';
import StakingWidget from '../StakingWidget';

import { motionCountdownTimerMsg as MSG } from './motionCountdownTimerMsg';

import styles from './DefaultAction.css';
import motionSpecificStyles from './MintTokenMotion.css';

const displayName = 'dashboard.ActionsPage.MintTokenMotion';

interface Props {
  colony: Colony;
  colonyAction: ColonyActionQuery['colonyAction'];
  token: TokenInfoQuery['tokenInfo'];
  transactionHash: string;
  recipient: AnyUser;
  initiator: AnyUser;
}

interface MotionValue {
  motionId: number;
}

const MintTokenMotion = ({
  colony,
  colonyAction: {
    events = [],
    createdAt: actionCreatedAt,
    actionType,
    annotationHash,
    colonyDisplayName,
    amount,
    motionId,
    motionState,
    motionDomain,
    actionInitiator,
  },
  colonyAction,
  token: { decimals, symbol },
  transactionHash,
  initiator,
}: Props) => {
  const { passedTag, failedTag, ...tags } = useMemo(() => {
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

  const { data: motionsSystemMessagesData } = useMotionsSystemMessagesQuery({
    variables: {
      motionId,
      colonyAddress: colony.colonyAddress,
    },
  });
  const { data: motionEventsData } = useEventsForMotionQuery({
    variables: { colonyAddress: colony.colonyAddress, motionId },
  });

  const actionAndEventValues = {
    actionType,
    amount: (
      <Numeral value={amount} unit={getTokenDecimalsWithFallback(decimals)} />
    ),
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
    ...tags,
  };
  const motionStyles = MOTION_TAG_MAP[motionState || MotionState.Invalid];

  return (
    <div className={styles.main}>
      <div className={styles.upperContainer}>
        <p className={styles.tagWrapper}>
          <Tag
            text={motionStyles.name}
            appearance={{
              theme: motionStyles.theme as TagAppearance['theme'],
              /*
               * @NOTE Prettier is being stupid
               */
              // eslint-disable-next-line max-len
              colorSchema: motionStyles.colorSchema as TagAppearance['colorSchema'],
            }}
          />
        </p>
        <div className={styles.countdownContainer}>
          <CountDownTimer
            createdAt={actionCreatedAt}
            colonyAddress={colony.colonyAddress}
            text={MSG.stake}
            periodType="stakePeriod"
          />
        </div>
      </div>
      <hr className={styles.dividerTop} />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            <FormattedMessage
              id="motion.title"
              values={{
                ...actionAndEventValues,
              }}
            />
          </h1>
          {annotationHash && (
            <ActionsPageFeedItem
              createdAt={actionCreatedAt}
              user={initiator}
              annotation
              comment={annotationHash}
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
          />
        </div>
        <div className={styles.details}>
          {motionState === MotionState.StakeRequired && (
            <StakingWidget
              motionId={motionId}
              motionDomainId={motionDomain}
              rootHash={rootHash}
              colonyAddress={colony.colonyAddress}
              tokenDecimals={decimals}
            />
          )}
          {motionState === MotionState.Voting && (
            <VoteWidget
              colony={colony}
              actionType={actionType}
              motionId={motionId}
              motionDomain={motionDomain}
            />
          )}
          {motionState === MotionState.Reveal && (
            <RevealWidget colony={colony} motionId={motionId} />
          )}
          {(motionState === MotionState.Failed ||
            motionState === MotionState.Passed) && (
            <FinalizeMotionWidget
              colony={colony}
              actionType={actionType}
              motionId={motionId}
              motionDomain={motionDomain}
            />
          )}
          <DetailsWidget
            actionType={actionType as ColonyMotions}
            transactionHash={transactionHash}
            colony={colony}
          />
        </div>
      </div>
    </div>
  );
};

MintTokenMotion.displayName = displayName;

export default MintTokenMotion;
