import React from 'react';

import { TaskCommentType } from '~immutable/index';

import { PreserveLinebreaks } from '~utils/components';
import ExternalLink from '~core/ExternalLink';
import TimeRelative from '~core/TimeRelative';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { useCurrentUser } from '~data/helpers';
import { useDataSubscriber, useSelector } from '~utils/hooks';

import { userSubscriber } from '../../../users/subscribers';
import TextDecorator from '../../../../lib/TextDecorator';
import { friendlyUsernameSelector } from '../../../users/selectors';

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

  const { walletAddress } = useCurrentUser();

  const isCurrentUser = authorAddress === walletAddress;

  const { data: creator } = useDataSubscriber(
    userSubscriber,
    [authorAddress],
    [authorAddress],
  );
  const userDisplayName = useSelector(friendlyUsernameSelector, [
    authorAddress,
  ]);
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
        {!isCurrentUser && creator && (
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
