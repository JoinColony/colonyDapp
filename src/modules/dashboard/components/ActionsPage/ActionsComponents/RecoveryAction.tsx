import React, { useMemo, useRef } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import FriendlyName from '~core/FriendlyName';
import PermissionsLabel from '~core/PermissionsLabel';
import Comment, { CommentInput } from '~core/Comment';
import ActionsPageFeed, {
  SystemInfo,
  SystemMessage,
  ActionsPageFeedType,
  ActionsPageFeedItemWithIPFS,
  ActionsPageEvent,
  EventValues,
  FeedItemWithId,
  ActionsPageSystemInfo,
  ActionsPageSystemMessage,
} from '~dashboard/ActionsPageFeed';

import {
  useLoggedInUser,
  Colony,
  ColonyActionQuery,
  TokenInfoQuery,
  AnyUser,
  useRecoveryEventsForSessionQuery,
  useRecoverySystemMessagesForSessionQuery,
  ParsedEvent,
  TransactionMessageFragment,
} from '~data/index';
import { ColonyActions, ColonyAndExtensionsEvents } from '~types/index';

import MultisigWidget from '../MultisigWidget';
import InputStorageWidget from '../InputStorageWidget';
import DetailsWidget from '../DetailsWidget/DetailsWidget';
import ApproveExitWidget from '../ApproveExitWidget';

import styles from './DefaultAction.css';
import recoverySpecificStyles from './RecoveryAction.css';

const MSG = defineMessages({
  recoveryTag: {
    id: 'dashboard.ActionsPage.RecoveryAction.recovery',
    defaultMessage: `Recovery`,
  },
  tip: {
    id: 'dashboard.ActionsPage.RecoveryAction.tip',
    defaultMessage: `{tipTitle} While in recovery mode the colony is disabled
and no actions may be taken.

A {role} permission holder may update storage slots to rectify the issue that
caused {user} to take this action.

A majority of {role} permission holders must satisfy themselves that this issue
has been overcome and the colony is secure, and sign a transaction to approve
exiting recovery mode, and then reactivate the colony.

Approvals are reset each time storage slots are updated.`,
  },
  tipTitle: {
    id: 'dashboard.ActionsPage.RecoveryAction.tipTitle',
    defaultMessage: 'Tip:',
  },
  newSlotValue: {
    id: 'dashboard.ActionsPage.RecoveryAction.newSlotValue',
    defaultMessage: 'New slot value',
  },
  previousSlotValue: {
    id: 'dashboard.ActionsPage.RecoveryAction.previousSlotValue',
    defaultMessage: 'Previous value: {slotValue}',
  },
  approvalResetNotice: {
    id: 'dashboard.ActionsPage.RecoveryAction.approvalResetNotice',
    defaultMessage: 'Approvals to exit recovery have been reset.',
  },
});

const displayName = 'dashboard.ActionsPage.RecoveryAction';

interface Props {
  colony: Colony;
  colonyAction: ColonyActionQuery['colonyAction'];
  token: TokenInfoQuery['tokenInfo'];
  transactionHash: string;
  recipient: AnyUser;
  initiator: AnyUser;
}

const RecoveryAction = ({
  colony,
  colony: { colonyAddress },
  colonyAction: {
    events = [],
    createdAt: actionCreatedAt,
    actionType,
    annotationHash,
    colonyDisplayName,
    blockNumber,
  },
  colonyAction,
  transactionHash,
  recipient,
  initiator,
}: Props) => {
  const bottomElementRef = useRef<HTMLInputElement>(null);
  const { username: currentUserName, ethereal } = useLoggedInUser();

  const fallbackStorageSlotValue = `0x${'0'.padStart(64, '0')}`;

  const {
    data: recoveryEvents,
    loading: recoveryEventsLoading,
  } = useRecoveryEventsForSessionQuery({
    variables: {
      blockNumber,
      colonyAddress,
    },
    pollInterval: 1000,
  });

  const {
    data: recoverySystemMessages,
    loading: recoverySystemMessagesLoading,
  } = useRecoverySystemMessagesForSessionQuery({
    variables: {
      blockNumber,
      colonyAddress,
    },
    pollInterval: 1000,
  });

  const isInRecoveryMode = useMemo(() => {
    if (recoveryEvents?.recoveryEventsForSession) {
      return !recoveryEvents.recoveryEventsForSession.find(
        ({ name }) => name === ColonyAndExtensionsEvents.RecoveryModeExited,
      );
    }
    return false;
  }, [recoveryEvents]);

  /*
   * @NOTE We need to convert the action type name into a forced camel-case string
   *
   * This is because it might have a name that contains spaces, and ReactIntl really
   * doesn't like that...
   */
  const actionAndEventValues = {
    actionType,
    initiator: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={initiator} autoShrinkAddress />
      </span>
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
  };

  const recoveryModeSystemInfo: SystemInfo = {
    type: ActionsPageFeedType.SystemInfo,
    text: MSG.tip,
    /*
     * Position in the feed array
     * This is because these can be inserted at any point the feed and are not
     * affected by creation time / date
     */
    position: 1,
    textValues: {
      tipTitle: (
        <span className={recoverySpecificStyles.tipTitle}>
          <FormattedMessage {...MSG.tipTitle} />
        </span>
      ),
      user: (
        <span className={styles.titleDecoration}>
          <FriendlyName user={initiator} autoShrinkAddress />
        </span>
      ),
      role: (
        <PermissionsLabel
          permission={ColonyRole.Recovery}
          name={{ id: `role.${ColonyRole.Recovery}` }}
        />
      ),
    },
    appearance: { theme: 'recovery' },
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <p className={styles.recoveryTag}>
          <FormattedMessage {...MSG.recoveryTag} />
        </p>
      </div>
      <hr className={styles.dividerTop} />
      <div className={styles.container}>
        <div className={styles.content}>
          {/*
           * @NOTE Can't use `Heading` here since it uses `formmatedMessage` internally
           * for message descriptors, and that doesn't support our complex text values
           */}
          <h1 className={styles.heading} data-test="actionHeading">
            <FormattedMessage
              id="action.title"
              values={{
                ...actionAndEventValues,
              }}
            />
          </h1>
          {annotationHash && (
            <ActionsPageFeedItemWithIPFS
              createdAt={actionCreatedAt}
              colony={colony}
              user={initiator}
              annotation
              hash={annotationHash}
            />
          )}
          <ActionsPageFeed
            actionType={actionType}
            transactionHash={transactionHash as string}
            networkEvents={[
              ...events,
              ...(recoveryEvents?.recoveryEventsForSession || []),
            ]}
            systemInfos={[recoveryModeSystemInfo]}
            systemMessages={
              /*
               * @NOTE Prettier is stupid, it keeps changing this line in a way that
               * breaks it
               */
              // eslint-disable-next-line prettier/prettier,max-len
              recoverySystemMessages?.recoverySystemMessagesForSession as SystemMessage[]
            }
            values={actionAndEventValues}
            actionData={colonyAction}
            colony={colony}
            loading={recoveryEventsLoading || recoverySystemMessagesLoading}
          >
            {(feedItems) =>
              feedItems.map((item, index) => {
                /*
                 * Event
                 */
                if (item.type === ActionsPageFeedType.NetworkEvent) {
                  const {
                    name,
                    createdAt,
                    emmitedBy,
                    uniqueId,
                    values: eventValues,
                  } = item as FeedItemWithId<ParsedEvent>;
                  return (
                    <ActionsPageEvent
                      key={uniqueId}
                      eventIndex={index}
                      createdAt={new Date(createdAt)}
                      transactionHash={transactionHash}
                      eventName={name}
                      actionData={colonyAction}
                      values={{
                        ...((eventValues as unknown) as EventValues),
                        ...actionAndEventValues,
                      }}
                      emmitedBy={emmitedBy}
                      colony={colony}
                      dataTest="recoveryActionEvent"
                    >
                      {name ===
                        ColonyAndExtensionsEvents.RecoveryStorageSlotSet && (
                        <div
                          className={recoverySpecificStyles.additionalEventInfo}
                        >
                          <div className={recoverySpecificStyles.storageSlot}>
                            <FormattedMessage
                              tagName="p"
                              {...MSG.newSlotValue}
                            />
                            <div
                              className={recoverySpecificStyles.slotValue}
                              data-test="newSlotValueEvent"
                            >
                              {((eventValues as unknown) as EventValues)
                                ?.toValue || fallbackStorageSlotValue}
                            </div>
                            <p
                              className={
                                recoverySpecificStyles.previousSlotValue
                              }
                            >
                              <FormattedMessage
                                {...MSG.previousSlotValue}
                                values={{
                                  slotValue: (
                                    <span>
                                      {((eventValues as unknown) as EventValues)
                                        ?.fromValue || fallbackStorageSlotValue}
                                    </span>
                                  ),
                                }}
                              />
                            </p>
                          </div>
                          <p
                            className={
                              recoverySpecificStyles.approvalResetNotice
                            }
                          >
                            <FormattedMessage {...MSG.approvalResetNotice} />
                          </p>
                        </div>
                      )}
                    </ActionsPageEvent>
                  );
                }
                /*
                 * Comment
                 */
                if (item.type === ActionsPageFeedType.ServerComment) {
                  const {
                    initiator: messageInitiator,
                    createdAt,
                    context: { message },
                    uniqueId,
                  } = (item as unknown) as FeedItemWithId<
                    TransactionMessageFragment
                  >;
                  return (
                    <Comment
                      key={uniqueId}
                      createdAt={createdAt}
                      colony={colony}
                      comment={message}
                      user={messageInitiator}
                    />
                  );
                }
                /*
                 * System Info
                 */
                if (item.type === ActionsPageFeedType.SystemInfo) {
                  const {
                    text,
                    textValues,
                    appearance,
                    uniqueId,
                  } = item as FeedItemWithId<SystemInfo>;
                  return (
                    <ActionsPageSystemInfo
                      key={uniqueId}
                      tip={text}
                      tipValues={textValues}
                      appearance={appearance}
                    />
                  );
                }
                /*
                 * System Message
                 */
                if (item.type === ActionsPageFeedType.SystemMessage) {
                  const { uniqueId } = item as FeedItemWithId<SystemMessage>;
                  return (
                    <ActionsPageSystemMessage
                      key={uniqueId}
                      systemMessage={item as SystemMessage}
                    />
                  );
                }
                return null;
              })
            }
          </ActionsPageFeed>
          {/*
           *  @NOTE A user can comment only if he has a wallet connected
           * and a registered user profile
           */}
          {currentUserName && !ethereal && (
            <div ref={bottomElementRef} className={styles.commentBox}>
              <CommentInput
                transactionHash={transactionHash}
                colonyAddress={colonyAddress}
              />
            </div>
          )}
        </div>
        <div className={styles.details}>
          {isInRecoveryMode && (
            <>
              <ApproveExitWidget
                colony={colony}
                startBlock={blockNumber}
                scrollToRef={bottomElementRef}
              />
              <InputStorageWidget
                colony={colony}
                startBlock={blockNumber}
                scrollToRef={bottomElementRef}
              />
            </>
          )}
          <MultisigWidget
            colony={colony}
            startBlock={blockNumber}
            scrollToRef={bottomElementRef}
            isInRecoveryMode={isInRecoveryMode}
          />
          <DetailsWidget
            actionType={actionType as ColonyActions}
            recipient={recipient}
            transactionHash={transactionHash}
            values={actionAndEventValues}
            colony={colony}
          />
        </div>
      </div>
    </div>
  );
};

RecoveryAction.displayName = displayName;

export default RecoveryAction;
