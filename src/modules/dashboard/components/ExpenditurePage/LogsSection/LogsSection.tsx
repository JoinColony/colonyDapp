import React, { useCallback, useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './LogsSection.css';
import { colonyAction, systemMessages, transactionHash } from './constants';
import { useLoggedInUser } from '~data/helpers';
import Comment, { CommentInput } from '~core/Comment';
import { TransactionMeta } from '~dashboard/ActionsPage';
import ActionsPageFeed, {
  ActionsPageEvent,
  ActionsPageFeedType,
  EventValues,
  FeedItemWithId,
  SystemMessagesName,
} from '~dashboard/ActionsPageFeed';
import { Colony, ParsedEvent, TransactionMessageFragment } from '~data/index';
import FriendlyName from '~core/FriendlyName';
import MemberReputation from '~core/MemberReputation';
import PortalWrapper from '../PortalWrapper';

const MSG = defineMessages({
  commentPlaceholder: {
    id: 'dashboard.ExpenditurePage.ExpenditureLogs.commentPlaceholder',
    defaultMessage: 'What would you like to say?',
  },
  emptyLog: {
    id: 'dashboard.ExpenditurePage.ExpenditureLogs.emptyLog',
    defaultMessage: 'Log event',
  },
});

export const ifIsSystemMessage = (name: string) => {
  if (
    name === SystemMessagesName.ExpenditureStaked ||
    name === SystemMessagesName.ExpenditureFunding ||
    name === SystemMessagesName.ExpenditureModified ||
    name === SystemMessagesName.ExpenditureCreatedDraft ||
    name === SystemMessagesName.ExpenditureCancelledDraft ||
    name === SystemMessagesName.ExpenditureClaimedStake ||
    name === SystemMessagesName.ExpenditureLocked ||
    name === SystemMessagesName.ExpenditureMotionModified ||
    name === SystemMessagesName.ExpenditureOwnerChange ||
    name === SystemMessagesName.ExpenditureMotionOwnerChange ||
    name === SystemMessagesName.ExpenditureMotionFunding ||
    name === SystemMessagesName.ExpenditureFunded ||
    name === SystemMessagesName.ExpenditureReleaseFunds ||
    name === SystemMessagesName.ExpenditureFundsClaimed ||
    name === SystemMessagesName.ExpenditureAllFundsClaimed
  ) {
    return true;
  }
  return false;
};

const displayName = 'LogsSection';

interface Props {
  colony: Colony;
}

const LogsSection = ({ colony }: Props) => {
  const { username: currentUserName, ethereal } = useLoggedInUser();
  const commentRef = useRef<HTMLDivElement>(null);
  const [commentWrapper, setCommentWrapper] = useState<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    // Force a rerender, so it can be passed to the child.
    setCommentWrapper(commentRef.current);
  }, [commentRef]);

  // add fetching systemMessages here, mocks are used now

  const additionalValues = useCallback(
    (feedItem) => {
      const { name, changes, user, funds } = feedItem;

      return {
        name,
        changes:
          changes?.map((change, changeIndex) => (
            <span
              className={styles.change}
              key={`${changeIndex}_${changes?.length}`}
            >
              <FormattedMessage
                id={`systemMessage.change.${change.changeType}`}
                values={{
                  prevState: change.prevValue,
                  recipient: (
                    <span>
                      @<FriendlyName user={change.recipient} />
                    </span>
                  ),
                  value: change.currValue,
                }}
              />
              {changeIndex !== changes.length - 1 ? ',' : '.'}
              {changeIndex === changes.length - 2 && ' and '}
            </span>
          )) || '',
        reputation: (
          <span className={styles.reputationStarWrapper}>
            <span className={styles.reputationWrapper}>
              {user && colony.colonyAddress && (
                <MemberReputation
                  walletAddress={user.profile.walletAddress}
                  colonyAddress={colony.colonyAddress}
                />
              )}
            </span>
          </span>
        ),
        funds:
          funds?.map((fund, idx) => (
            <span className={styles.change} key={`${idx}_${funds?.length}`}>
              {fund}
              {idx !== funds.length - 1 ? ',' : '.'}
            </span>
          )) || '',
        initiator: (
          <span className={styles.titleDecoration}>
            <FriendlyName user={user} autoShrinkAddress />
          </span>
        ),
      };
    },
    [colony.colonyAddress],
  );

  return (
    <div className={styles.container}>
      {!systemMessages ? (
        <div className={styles.logContainer}>
          <div className={styles.dotContainer}>
            <div className={styles.dot} />
          </div>
          <div>
            <FormattedMessage {...MSG.emptyLog} />
            <div className={styles.transactionMeta}>
              <TransactionMeta createdAt={new Date()} />
            </div>
          </div>
        </div>
      ) : (
        <ActionsPageFeed
          transactionHash={transactionHash}
          colony={colony}
          systemMessages={systemMessages}
          actionData={colonyAction}
        >
          {(sortedFeed) => {
            return sortedFeed.map((feedItem, index) => {
              /*
               * Comment
               */
              if (feedItem.type === ActionsPageFeedType.ServerComment) {
                const {
                  initiator: messageInitiator,
                  createdAt,
                  context: { message, deleted, adminDelete, userBanned },
                  uniqueId,
                  sourceId,
                } = (feedItem as unknown) as FeedItemWithId<
                  TransactionMessageFragment
                >;
                return (
                  <Comment
                    key={uniqueId}
                    createdAt={createdAt}
                    colony={colony}
                    comment={message}
                    commentMeta={{
                      id: sourceId,
                      deleted,
                      adminDelete,
                      userBanned,
                    }}
                    user={messageInitiator}
                    showControls
                  />
                );
              }
              /*
               * System Message
               */
              if (feedItem.type === ActionsPageFeedType.SystemMessage) {
                const {
                  name,
                  createdAt,
                  emmitedBy,
                  uniqueId,
                  values: eventValues,
                  transactionHash: eventTransactionHash,
                } = feedItem as FeedItemWithId<ParsedEvent>;
                return (
                  <ActionsPageEvent
                    key={uniqueId}
                    eventIndex={index}
                    createdAt={new Date(createdAt)}
                    transactionHash={eventTransactionHash}
                    eventName={name}
                    actionData={colonyAction}
                    values={{
                      ...((eventValues as unknown) as EventValues),
                      ...additionalValues(feedItem),
                    }}
                    emmitedBy={emmitedBy}
                    colony={colony}
                    rootHash={transactionHash}
                  />
                );
              }
              return null;
            });
          }}
        </ActionsPageFeed>
      )}
      {/*
       *  @NOTE A user can comment only if he has a wallet connected
       * and a registered user profile,
       */}
      <div ref={commentRef}>
        {currentUserName && !ethereal && commentWrapper && (
          <div className={styles.commentInput}>
            <PortalWrapper element={commentRef?.current}>
              <CommentInput
                colonyAddress={colony?.colonyAddress}
                transactionHash={transactionHash}
              />
            </PortalWrapper>
          </div>
        )}
      </div>
    </div>
  );
};

LogsSection.displayName = displayName;

export default LogsSection;
