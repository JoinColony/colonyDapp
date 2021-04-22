import React from 'react';
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
import CountdownTimer from '~core/CountdownTimer';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { MotionState, MOTION_TAG_MAP } from '~utils/colonyMotions';

import DetailsWidget from '../DetailsWidget';
import VoteWidget from '../VoteWidget';
import RevealWidget from '../RevealWidget';
import FinalizeMotionWidget from '../FinalizeMotionWidget';

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
    motionState,
    motionDomain,
    actionInitiator,
  },
  colonyAction,
  token: { decimals, symbol },
  transactionHash,
  initiator,
}: Props) => {
  const motionTag = MOTION_TAG_MAP[MotionState.Motion];
  const passedTag = MOTION_TAG_MAP[MotionState.Passed];
  const revealTag = MOTION_TAG_MAP[MotionState.Reveal];
  const objectionTag = MOTION_TAG_MAP[MotionState.Objection];
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
    motionTag: <Tag text={motionTag.name} appearance={{ theme: 'primary' }} />,
    passedTag: (
      <span className={motionSpecificStyles.tagWrapper}>
        <Tag
          text={passedTag.name}
          appearance={{ theme: 'primary', colorSchema: 'plain' }}
        />
      </span>
    ),
    revealTag: <Tag text={revealTag.name} appearance={{ theme: 'blue' }} />,
    objectionTag: (
      <Tag text={objectionTag.name} appearance={{ theme: 'danger' }} />
    ),
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
          <CountdownTimer
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
