import React, { ReactNode } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import { Address } from '~types/index';
import { AnyUser } from '~data/index';
import Icon from '~core/Icon';
import MaskedAddress from '~core/MaskedAddress';
import HookedUserAvatar from '~users/HookedUserAvatar';

import styles from './UserInfo.css';

const MSG = defineMessages({
  placeholder: {
    id: 'UserInfo.placeholder',
    defaultMessage: 'None',
  },
  selectUser: {
    id: 'UserInfo.selectUser',
    defaultMessage: 'Select user',
  },
});

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const defaultRenderAvatar = (address: Address, user?: AnyUser) => (
  <UserAvatar address={address} user={user} showInfo size="xs" />
);

interface Props {
  children?: ReactNode;
  placeholder?: MessageDescriptor;
  user?: AnyUser;
  userAddress?: Address;
  renderAvatar?: (address: Address, user?: AnyUser) => ReactNode;
}

const UserInfo = ({
  children,
  placeholder = MSG.placeholder,
  user,
  userAddress,
  renderAvatar = defaultRenderAvatar,
}: Props) => {
  let displayedName;
  if (children) {
    displayedName = children;
  } else {
    displayedName =
      user && user.profile
        ? user.profile.displayName || user.profile.username
        : userAddress;
  }
  return (
    <div className={styles.main}>
      {userAddress ? (
        <div className={styles.avatarContainer}>
          {renderAvatar(userAddress, user)}
        </div>
      ) : (
        <Icon
          className={styles.icon}
          name="circle-person"
          title={MSG.selectUser}
        />
      )}
      <div className={styles.nameContainer}>
        {user ? (
          <div className={styles.displayedName}>{displayedName}</div>
        ) : (
          <div className={styles.placeholder}>
            {userAddress ? (
              <MaskedAddress address={userAddress} />
            ) : (
              <FormattedMessage {...placeholder} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

UserInfo.displayName = 'users.UserInfo';

export default UserInfo;
