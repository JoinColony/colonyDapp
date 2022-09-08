import React, { useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyRoles } from '@colony/colony-js';

import { CommentInput } from '~core/Comment';
import ActionsPageFeed, {
  ActionsPageFeedItemWithIPFS,
  SystemMessage,
} from '~dashboard/ActionsPageFeed';
import ActionPageDecisionWithIPFS from '~dashboard/ActionsPage/ActionPageDecisionWithIPFS';

import { getUpdatedDecodedMotionRoles } from '~utils/colonyMotions';
import { useFormatRolesTitle } from '~utils/hooks/useFormatRolesTitle';

import {
  Colony,
  ColonyAction,
  AnyUser,
  useMotionsSystemMessagesQuery,
  useEventsForMotionQuery,
  useMotionObjectionAnnotationQuery,
  useUser,
  useColonyHistoricRolesQuery,
} from '~data/index';

import { EventValues } from '../../ActionsPageFeed/ActionsPageFeed';

import styles from './DefaultAction.css';
import motionSpecificStyles from './DefaultMotion.css';

const displayName = 'dashboard.ActionsPage.DefaultMotionPageFeed';

interface Props {
  colony: Colony;
  isDecision?: boolean;
  motionId: number;
  transactionHash: string;
  annotationHash: string;
  userHasProfile: boolean | '' | null | undefined;
  initiator: AnyUser;
  currentUserName: string;
  walletAddress: string;
  recipient: AnyUser;
  eventValues: EventValues;
  colonyAction: ColonyAction;
}

const DefaultMotionPageFeed = ({
  colony,
  isDecision = false,
  motionId,
  transactionHash,
  userHasProfile,
  initiator,
  currentUserName,
  walletAddress,
  recipient,
  eventValues,
  colonyAction,
  annotationHash,
  colonyAction: {
    events = [],
    actionType,
    rootHash,
    roles,
    fromDomain,
    blockNumber,
  },
}: Props) => {
  const bottomElementRef = useRef<HTMLInputElement>(null);

  const { data: objectionAnnotation } = useMotionObjectionAnnotationQuery({
    variables: {
      motionId,
      colonyAddress: colony.colonyAddress,
    },
    fetchPolicy: 'network-only',
  });

  const objectionAnnotationUser = useUser(
    objectionAnnotation?.motionObjectionAnnotation?.address || '',
  );

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

  const { data: historicColonyRoles } = useColonyHistoricRolesQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
      blockNumber,
    },
  });

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

  // Decision specific
  const commentInput = useMemo(
    () =>
      userHasProfile ? (
        <div ref={bottomElementRef} className={styles.commentBox}>
          <CommentInput
            transactionHash={transactionHash}
            colonyAddress={colony.colonyAddress}
          />
        </div>
      ) : null,
    [bottomElementRef, colony.colonyAddress, transactionHash, userHasProfile],
  );

  if (isDecision) {
    return (
      <div>
        <ActionPageDecisionWithIPFS
          colony={colony}
          user={initiator}
          username={currentUserName || ''}
          walletAddress={walletAddress}
          hash={annotationHash || ''}
        />

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
          values={eventValues}
          actionData={colonyAction}
          colony={colony}
          rootHash={rootHash || undefined}
        />
        {commentInput}
      </div>
    );
  }

  // NON-DECISION i.e. standard motion
  return (
    <>
      <h1 className={styles.heading} data-test="actionHeading">
        <FormattedMessage
          id={roleMessageDescriptorId || 'motion.title'}
          values={{
            ...eventValues,
            fromDomainName: eventValues.fromDomain?.name,
            toDomainName: eventValues.toDomain?.name,
            roles: roleTitle,
          }}
        />
      </h1>
      {objectionAnnotation?.motionObjectionAnnotation?.metadata && (
        <div className={motionSpecificStyles.annotation}>
          <ActionsPageFeedItemWithIPFS
            colony={colony}
            user={objectionAnnotationUser}
            annotation
            hash={objectionAnnotation?.motionObjectionAnnotation.metadata || ''}
            appearance={{ theme: 'danger' }}
          />
        </div>
      )}
      <div>
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
          values={eventValues}
          actionData={colonyAction}
          colony={colony}
          rootHash={rootHash || undefined}
        />
        {commentInput}
      </div>
    </>
  );
};

DefaultMotionPageFeed.displayName = displayName;

export default DefaultMotionPageFeed;
