/* @flow */

import React from 'react';

import type { TaskCommentType } from '~immutable';

import ExternalLink from '~core/ExternalLink';
import TimeRelative from '~core/TimeRelative';
import UserAvatar from '~core/UserAvatar';
import UserInfo from '~core/UserInfo';
import UserMention from '~core/UserMention';
import { PreserveLinebreaks } from '~utils/components';

import TextDecorator from '../../../../lib/TextDecorator';

import styles from './TaskFeedComment.css';

import mockUser from '../Wallet/__datamocks__/mockUser';

const displayName = 'dashboard.TaskFeed.TaskFeedComment';

type Props = {|
  comment: TaskCommentType,
  createdAt: Date,
  currentUser: boolean,
|};

const TaskFeedComment = ({
  comment: {
    content: { author: commentAuthorWalletAddress, body },
  },
  createdAt,
  currentUser,
}: Props) => {
  const { Decorate } = new TextDecorator({
    email: (text, normalized) => <ExternalLink text={text} href={normalized} />,
    link: (text, normalized) => <ExternalLink text={text} href={normalized} />,
    username: text => (
      <UserMention username={text.slice(1)} to={`/user/${text.slice(1)}`} />
    ),
  });
  /*
   * @TODO The comment author (wallet address) <-> user profile relationship
   * has to come from a reducer, since it's not available in the comments store
   */
  return (
    <div
      className={`${styles.comment} ${
        currentUser ? styles.commentSelf : styles.commentOther
      }`}
    >
      {!currentUser && (
        <div className={styles.commentAvatar}>
          <UserAvatar
            address={commentAuthorWalletAddress}
            displayName={mockUser.profile.displayName}
            hasUserInfo
            size="s"
            username={mockUser.profile.username}
          />
        </div>
      )}
      <div className={styles.commentMain}>
        {!currentUser && (
          <div className={styles.commentUsername}>
            <UserInfo
              address={commentAuthorWalletAddress}
              displayName={mockUser.profile.displayName}
              username={mockUser.profile.username}
            >
              <span>{mockUser.profile.displayName}</span>
            </UserInfo>
          </div>
        )}
        <div className={styles.commentBody}>
          <Decorate tagName={PreserveLinebreaks}>{body}</Decorate>
        </div>
        <div className={styles.commentTimestamp}>
          <TimeRelative value={createdAt} />
        </div>
      </div>
    </div>
  );
};

TaskFeedComment.displayName = displayName;

export default TaskFeedComment;
