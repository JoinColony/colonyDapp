/* @flow */

import React from 'react';

import type { TaskCommentType, UserType } from '~immutable';

import { PreserveLinebreaks } from '~utils/components';
import ExternalLink from '~core/ExternalLink';
import TimeRelative from '~core/TimeRelative';
import UserInfo from '~core/UserInfo';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { userFetcher } from '../../../users/fetchers';
import TextDecorator from '../../../../lib/TextDecorator';
import { walletAddressSelector } from '../../../users/selectors';

import styles from './TaskFeedComment.css';

import { useDataFetcher, useSelector } from '~utils/hooks';
import { addressEquals } from '~utils/strings';

const UserAvatar = HookedUserAvatar();

const displayName = 'dashboard.TaskFeed.TaskFeedComment';

type Props = {|
  comment: TaskCommentType,
  createdAt: Date,
|};

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

  const walletAddress = useSelector(walletAddressSelector, []);

  const isCurrentUser = addressEquals(authorAddress, walletAddress);

  const { data: creator } = useDataFetcher<UserType>(
    userFetcher,
    [authorAddress],
    [authorAddress],
  );
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
            <UserInfo user={creator}>
              <span>{creator.profile.displayName}</span>
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
