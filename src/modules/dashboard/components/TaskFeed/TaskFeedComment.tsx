import React from 'react';

import { TaskCommentType } from '~immutable/index';

import { PreserveLinebreaks } from '~utils/components';
import ExternalLink from '~core/ExternalLink';
import TimeRelative from '~core/TimeRelative';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { useLoggedInUser, useUser } from '~data/helpers';

import TextDecorator from '../../../../lib/TextDecorator';
import { getFriendlyName } from '../../../users/transformers';

import styles from './TaskFeedComment.css';

const UserAvatar = HookedUserAvatar();

const displayName = 'dashboard.TaskFeed.TaskFeedComment';

interface Props {
  comment: TaskCommentType;
  createdAt: Date;
}

const TaskFeedComment = ({
  comment: { authorAddress, body },
  createdAt,
}: Props) => {
  const { Decorate } = new TextDecorator({
    email: (text, normalized) => <ExternalLink text={text} href={normalized} />,
    link: (text, normalized) => <ExternalLink text={text} href={normalized} />,
    username: text => (
      <UserMention username={text.slice(1)} to={`/user/${text.slice(1)}`} />
    ),
  });

  const { walletAddress } = useLoggedInUser();

  const isCurrentUser = authorAddress === walletAddress;
  const author = useUser(authorAddress);
  const userDisplayName = getFriendlyName(author);
  return (
    <div
      className={`${styles.comment} ${
        isCurrentUser ? styles.commentSelf : styles.commentOther
      }`}
    >
      {!isCurrentUser && (
        <div className={styles.commentAvatar}>
          <UserAvatar address={authorAddress} showInfo size="s" />
        </div>
      )}
      <div className={styles.commentMain}>
        {!isCurrentUser && author && (
          <div className={styles.commentUsername}>
            <span>{userDisplayName}</span>
          </div>
        )}
        <div title={body} className={styles.commentBody}>
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
