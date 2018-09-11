/* @flow */
import React from 'react';

import Link from '../Link';

import styles from './UserMention.css';

type Props = {
  /** A user's ensName */
  ensName: string,
  /** Alternate place to link to. Defaults to user profile */
  to: string,
};

const UserMention = ({ ensName, to }: Props) => (
  <Link to={to} text={`@${ensName}`} className={styles.mentionLink} />
);

UserMention.defaultProps = {
  to: '/',
};

export default UserMention;
