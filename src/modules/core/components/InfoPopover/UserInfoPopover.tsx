import React from 'react';

import { AnyUser } from '~data/index';

import UserInfo from './UserInfo';
import NotAvailableMessage from './NotAvailableMessage';

import styles from './InfoPopover.css';

interface Props {
  user?: AnyUser;
  userNotAvailable?: boolean;
}

const displayName = 'InfoPopover.UserInfoPopover';

const UserInfoPopover = ({ user, userNotAvailable = false }: Props) => (
  <div className={styles.main}>
    <div className={styles.section}>
      {!userNotAvailable && user ? (
        <UserInfo user={user} />
      ) : (
        <NotAvailableMessage notAvailableDataName="User" />
      )}
    </div>
  </div>
);

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
