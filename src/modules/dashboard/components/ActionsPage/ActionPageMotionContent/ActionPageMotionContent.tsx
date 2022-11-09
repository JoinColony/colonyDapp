import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CommentInput } from '~core/Comment';
import ActionsPageFeed, {
  ActionsPageFeedItemWithIPFS,
  SystemMessage,
} from '~dashboard/ActionsPageFeed';

import {
  AnyUser,
  Colony,
  ColonyActionQuery,
  useEventsForMotionQuery,
  useMotionObjectionAnnotationQuery,
  useMotionsSystemMessagesQuery,
  useUser,
} from '~data/index';

import ActionPageDecisionWithIPFS from '../ActionPageDecisionWithIPFS';

import styles from './ActionPageMotionContent.css';

interface Props {
  colony: Colony;
  colonyAction: ColonyActionQuery['colonyAction'];
  isDecision: boolean;
  initiator: AnyUser;
  actionAndEventValues: any;
  roleTitle: string;
  transactionHash: string;
  userHasProfile: boolean;
  bottomElementRef: React.RefObject<HTMLInputElement>;
  motionId: number;
  createdAt: number;
  roleMessageDescriptorId?: string | null;
  annotationMessage?: string | null;
}

const ActionPageMotionContent = ({
  colony,
  colonyAction: { annotationHash, events = [], actionType, rootHash },
  colonyAction,
  isDecision,
  initiator,
  actionAndEventValues,
  roleTitle,
  transactionHash,
  userHasProfile,
  motionId,
  bottomElementRef,
  createdAt,
  roleMessageDescriptorId,
  annotationMessage,
}: Props) => {
  const { data: objectionAnnotation } = useMotionObjectionAnnotationQuery({
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

  const { data: motionsSystemMessagesData } = useMotionsSystemMessagesQuery({
    variables: {
      motionId,
      colonyAddress: colony.colonyAddress,
    },
    fetchPolicy: 'network-only',
  });

  const objectionAnnotationUser = useUser(
    objectionAnnotation?.motionObjectionAnnotation?.address || '',
  );

  return (
    <>
      {isDecision ? (
        <ActionPageDecisionWithIPFS
          colony={colony}
          user={initiator}
          hash={annotationHash || ''}
          createdAt={createdAt}
        />
      ) : (
        <h1 className={styles.heading} data-test="actionHeading">
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
      )}
      {!isDecision && (annotationHash || annotationMessage) && (
        <div className={styles.annotation}>
          <ActionsPageFeedItemWithIPFS
            colony={colony}
            user={initiator}
            annotation
            comment={annotationMessage || undefined}
            hash={annotationHash || undefined}
          />
        </div>
      )}
      {isDecision
        ? objectionAnnotation?.motionObjectionAnnotation?.metadata && (
            <div className={styles.annotation}>
              <ActionPageDecisionWithIPFS
                colony={colony}
                user={objectionAnnotationUser}
                hash={objectionAnnotation?.motionObjectionAnnotation?.metadata}
                isObjection
                createdAt={createdAt}
              />
            </div>
          )
        : objectionAnnotation?.motionObjectionAnnotation?.metadata && (
            <div className={styles.annotation}>
              <ActionsPageFeedItemWithIPFS
                colony={colony}
                user={objectionAnnotationUser}
                annotation
                hash={objectionAnnotation.motionObjectionAnnotation.metadata}
                appearance={{ theme: 'danger' }}
              />
            </div>
          )}

      <ActionsPageFeed
        actionType={actionType}
        transactionHash={transactionHash as string}
        networkEvents={[
          ...events,
          ...(motionEventsData?.eventsForMotion || []),
        ]}
        systemMessages={
          motionsSystemMessagesData?.motionsSystemMessages as SystemMessage[]
        }
        values={actionAndEventValues}
        actionData={colonyAction}
        colony={colony}
        rootHash={rootHash || undefined}
      />

      {userHasProfile && (
        <div ref={bottomElementRef} className={styles.commentBox}>
          <CommentInput
            transactionHash={transactionHash}
            colonyAddress={colony.colonyAddress}
          />
        </div>
      )}
    </>
  );
};

export default ActionPageMotionContent;
