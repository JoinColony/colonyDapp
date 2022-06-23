import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';
import styles from './LogsSection.css';
import {
  colony,
  colonyAction,
  systemMessages,
  transactionHash,
} from './constants';
import Log from './Log';
import { useLoggedInUser } from '~data/helpers';
import Comment, { CommentInput } from '~core/Comment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Input } from '~core/Fields';
import { TransactionMeta } from '~dashboard/ActionsPage';
import ActionsPageFeed, {
  ActionsPageFeedType,
  ExtendedSystemMessage,
  FeedItemWithId,
  SystemMessage,
} from '~dashboard/ActionsPageFeed';
import { TransactionMessageFragment } from '~data/index';

const MSG = defineMessages({
  commentPlaceholder: {
    id: 'dashboard.Expenditures.ExpenditureLogs.commentPlaceholder',
    defaultMessage: 'What would you like to say?',
  },
  emptyLog: {
    id: 'dashboard.Expenditures.ExpenditureLogs.emptyLog',
    defaultMessage: 'Log event',
  },
});

interface Props {
  colonyAddress: string;
  isFormEditable?: boolean;
}

const LogsSection = ({ colonyAddress }: Props) => {
  const { username: currentUserName, ethereal } = useLoggedInUser();
  // add fetching systemMessages here

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
          colony={colony as any}
          systemMessages={systemMessages}
          actionData={colonyAction}
        >
          {(sortedFeed) => {
            return sortedFeed.map((feedItem) => {
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
                    colony={colony as any}
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
                const { uniqueId } = feedItem as FeedItemWithId<SystemMessage>;
                return (
                  <Log
                    {...(feedItem as ExtendedSystemMessage)}
                    key={uniqueId}
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
       
       * also input is disabled when the form is editable
       
       * "isFormEditable" isn't change to false right now, so below code is commented.
       */}
      {currentUserName && !ethereal && (
        // <>
        //   {isFormEditable ? (
        //     <div className={styles.disabledComment}>
        //       <Input
        //         name="disabled"
        //         placeholder={MSG.commentPlaceholder}
        //         elementOnly
        //         disabled
        //       />
        //     </div>
        //   ) : (
        <div className={styles.commentInput}>
          <CommentInput
            {...{
              colonyAddress,
              transactionHash,
            }}
          />
        </div>
        //   )}
        // </>
      )}
    </div>
  );
};

export default LogsSection;
