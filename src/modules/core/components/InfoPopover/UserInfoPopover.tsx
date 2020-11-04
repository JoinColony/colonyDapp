import React from 'react';

import { AnyUser } from '~data/index';

import UserInfo from './UserInfo';
import UserInfoNotAvailable from './UserInfoNotAvailable';

import styles from './InfoPopover.css';

interface Props {
  user?: AnyUser;
  userNotAvailable?: boolean;
}

const displayName = 'InfoPopover.UserInfoPopover';

const UserInfoPopover = ({ user, userNotAvailable = false }: Props) => (
  <div className={styles.main}>
    <div className={styles.section}>
      {userNotAvailable && <UserInfoNotAvailable />}
      {!userNotAvailable && user && <UserInfo user={user} />}
    </div>
  </div>
);

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
