import React from 'react';

import Link from '../Link';

import styles from './UserMention.css';

interface Props {
  /** A user's username (ENS) */
  username: string;

  /** Alternate place to link to. Defaults to user profile */
  to?: string;

  /** Either just display mention or link to profile or so  */
  hasLink?: boolean;

  title?: string;
}

const UserMention = ({ username, to, hasLink, ...props }: Props) => {
  const fallbackTo = to || `/user/${username}`;
  if (hasLink) {
    return (
      <Link
        to={fallbackTo}
        text={`@${username}`}
        className={styles.mention}
        {...props}
      />
    );
  }
  return (
    <span className={styles.mention} {...props}>
      {' '}
      {`@${username}`}
    </span>
  );
};

export default UserMention;
