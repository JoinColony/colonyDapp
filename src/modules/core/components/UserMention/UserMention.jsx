/* @flow */
import React from 'react';

import Link from '../Link';

import styles from './UserMention.css';

type Props = {
  /** A user's username (ENS) */
  username: string,
  /** Alternate place to link to. Defaults to user profile */
  to: string,
  /** Either just display mention or link to profile or so  */
  hasLink?: boolean,
};

const UserMention = ({ username, to, hasLink }: Props) =>
  hasLink ? (
    <Link to={to} text={`@${username}`} className={styles.mention} />
  ) : (
    <span className={styles.mention}> {`@${username}`} </span>
  );

UserMention.defaultProps = {
  to: '/',
  hasLink: true,
};

export default UserMention;
