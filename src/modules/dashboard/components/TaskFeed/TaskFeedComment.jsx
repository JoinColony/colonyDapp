/* @flow */

import React from 'react';

import ExternalLink from '~core/ExternalLink';
import TimeRelative from '~core/TimeRelative';
import UserAvatar from '~core/UserAvatar';
import UserInfo from '~core/UserInfo';
import UserMention from '~core/UserMention';
import { PreserveLinebreaks } from '~utils/components';

import TextDecorator from '../../../../lib/TextDecorator';

import styles from './TaskFeedComment.css';

import type { TaskFeedItemCommentRecord } from '~immutable';

const displayName = 'dashboard.TaskFeed.TaskFeedComment';

type Props = {
  comment: TaskFeedItemCommentRecord,
  createdAt: Date,
  currentUser: boolean,
};

const TaskFeedComment = ({
  comment: {
    body,
    user: {
      profile: { avatar, username, displayName: fullName, walletAddress },
    },
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
  return (
    <div
      className={`${styles.comment} ${
        currentUser ? styles.commentSelf : styles.commentOther
      }`}
    >
      {!currentUser && (
        <div className={styles.commentAvatar}>
          <UserAvatar
            avatarURL={avatar}
            displayName={fullName}
            hasUserInfo
            username={username}
            walletAddress={walletAddress}
            size="s"
          />
        </div>
      )}
      <div className={styles.commentMain}>
        {!currentUser && (
          <div className={styles.commentUsername}>
            <UserInfo
              displayName={fullName}
              username={username}
              walletAddress={walletAddress}
            >
              <span>{fullName}</span>
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
