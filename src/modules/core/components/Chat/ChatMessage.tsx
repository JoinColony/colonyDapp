import React from 'react';

import HookedUserAvatar from '~users/HookedUserAvatar';
import TimeRelative from '~core/TimeRelative';
import MaskedAddress from '~core/MaskedAddress';
import Link from '~core/NavLink';
import { AnyUser, useUser } from '~data/index';

import styles from './ChatMessage.css';

// @todo Obviously this is not the right interface for the data we get in the future
interface Comment {
  author: string;
  comment: string;
  id: string;
  room: string;
  timestamp: number;
}

interface Props {
  message: Comment;
}

const displayName = 'Chat.ChatMessage';

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const renderUsername = ({
  profile: { username, displayName: userDisplayName, walletAddress },
}: AnyUser) => {
  if (username) {
    return (
      <Link to={`/user/${username.toLowerCase()}`}>
        {userDisplayName || username}
      </Link>
    );
  }
  return <MaskedAddress address={walletAddress} />;
};

const ChatMessage = ({ message: { comment, author, timestamp } }: Props) => {
  const user = useUser(author);
  return (
    <div className={styles.main}>
      <div className={styles.avatar}>
        <UserAvatar address={author} user={user} size="xs" notSet={false} />
      </div>
      <div className={styles.commentMain}>
        <div>
          <span className={styles.username}>{renderUsername(user)}</span>
          <TimeRelative
            className={styles.timestamp}
            value={new Date(timestamp)}
          />
        </div>
        <div>{comment}</div>
      </div>
    </div>
  );
};

ChatMessage.displayName = displayName;

export default ChatMessage;
