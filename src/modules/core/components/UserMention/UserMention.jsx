/* @flow */
import React from 'react';

import Link from '../Link';

import styles from './UserMention.css';

type Props = {
  /** A user's username (ENS) */
  username: string,
  /** Alternate place to link to. Defaults to user profile */
  to: string,
};

const UserMention = ({ username, to }: Props) => (
  <Link to={to} text={`@${username}`} className={styles.mentionLink} />
);

UserMention.defaultProps = {
  to: '/',
};

export default UserMention;
