import React from 'react';

import { AnyUser } from '~data/index';

import styles from './InfoPopover.css';
import UserInfo from './UserInfo';

interface Props {
  user: AnyUser;
}

const displayName = 'InfoPopover.UserInfoPopover';

const UserInfoPopover = ({ user }: Props) => (
  <div className={styles.main}>
    <div className={styles.section}>
      <UserInfo user={user} />
    </div>
  </div>
);

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
