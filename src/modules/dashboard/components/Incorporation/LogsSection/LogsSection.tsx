import React, { useCallback, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

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
import MemberReputation from '~core/MemberReputation';
import { capitalize } from '~utils/strings';

import { colonyAction, systemMessages, transactionHash } from './constants';
import styles from './LogsSection.css';

const MSG = defineMessages({
  commentPlaceholder: {
    id: 'dashboard.Incorporation.LogsSection.commentPlaceholder',
    defaultMessage: 'What would you like to say?',
  },
  emptyLog: {
    id: 'dashboard.Incorporation.LogsSection.emptyLog',
    defaultMessage: 'Log event',
  },
  name: {
    id: 'dashboard.Incorporation.LogsSection.name',
    defaultMessage: 'Corporation name',
  },
  puropse: {
    id: 'dashboard.Incorporation.LogsSection.purpose',
    defaultMessage: 'DAO Purpose',
  },
  alternativeName: {
    id: 'dashboard.Incorporation.LogsSection.alternativeName',
    defaultMessage: 'Corporation alternative name',
  },
  protectors: {
    id: 'dashboard.Incorporation.LogsSection.protectors',
    defaultMessage: 'Protectors',
  },
  mainContact: {
    id: 'dashboard.Incorporation.LogsSection.mainContact',
    defaultMessage: 'Main Contact',
  },
  signOption: {
    id: 'dashboard.Incorporation.LogsSection.signOption',
    defaultMessage: 'Sign Option',
  },
  description: {
    id: 'dashboard.Incorporation.LogsSection.description',
    defaultMessage: 'Description',
  },
});

export const isSystemMessageIncorporation = (name: string) => {
  return [
    SystemMessagesName.IncorporationCreated,
    SystemMessagesName.IncorporationStaked,
    SystemMessagesName.IncorporationOwnerOrForceEdit,
    SystemMessagesName.IncorporationMotionModified,
    SystemMessagesName.IncorporationMotionPayment,
    SystemMessagesName.IncorporationFailedMotionPayment,
    SystemMessagesName.IncorporationPassedMotionPayment,
    SystemMessagesName.IncorporationWaitingOnIndemnityForms,
    SystemMessagesName.IncorporationCompleted,
  ].includes(name as SystemMessagesName);
};

const displayName = 'dashboard.Incorporation.LogsSection';

interface Props {
  colony?: Colony;
}

const LogsSection = ({ colony }: Props) => {
  const { username: currentUserName, ethereal } = useLoggedInUser();

  // add fetching systemMessages here, mocks are used now

  const changeMessage = useCallback((changeType: string) => {
    switch (changeType) {
      case 'name': {
        return <FormattedMessage {...MSG.name} />;
      }
      case 'puropse': {
        return <FormattedMessage {...MSG.puropse} />;
      }
      case 'protectors': {
        return <FormattedMessage {...MSG.protectors} />;
      }
      case 'mainContact': {
        return <FormattedMessage {...MSG.mainContact} />;
      }
      case 'alternativeName': {
        return <FormattedMessage {...MSG.alternativeName} />;
      }
      default: {
        return capitalize(changeType);
      }
    }
  }, []);

  const additionalValues = useCallback(
    (feedItem) => {
      const { name, changes, user } = feedItem;

      return {
        name,
        changes:
          changes?.map((change, index) => (
            <Fragment key={index}>
              {changeMessage(change.changeType)}
              {index !== changes.length - 1 ? ', ' : ''}
              {index === changes.length - 2 && ' and '}
            </Fragment>
          )) || '',
        reputation: (
          <span className={styles.reputationStarWrapper}>
            <span className={styles.reputationWrapper}>
              {user && colony?.colonyAddress && (
                <MemberReputation
                  walletAddress={user.profile.walletAddress}
                  colonyAddress={colony.colonyAddress}
                />
              )}
            </span>
          </span>
        ),
      };
    },
    [changeMessage, colony],
  );

  return (
    <div className={styles.container}>
      <hr className={styles.divider} />
      {!systemMessages || !colony ? (
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
      {currentUserName && !ethereal && colony && (
        <div className={styles.commentInput}>
          <CommentInput
            colonyAddress={colony?.colonyAddress}
            transactionHash={transactionHash}
            isRequired
          />
        </div>
      )}
    </div>
  );
};

LogsSection.displayName = displayName;

export default LogsSection;
