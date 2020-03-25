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

const defaultRenderAvatar = (
  address: Address,
  user?: AnyUser,
  colonyAddress?: Address,
  skillId?: number,
) => (
  <UserAvatar
    address={address}
    colonyAddress={colonyAddress}
    skillId={skillId}
    user={user}
    showInfo
    size="xs"
  />
);

interface Props {
  children?: ReactNode;
  colonyAddress: Address;
  placeholder?: MessageDescriptor;
  user?: AnyUser;
  userAddress?: Address;
  renderAvatar?: (
    address: Address,
    user?: AnyUser,
    colonyAddress?: Address,
    skillId?: number,
  ) => ReactNode;
  skillId?: number;
}

const UserInfo = ({
  children,
  colonyAddress,
  placeholder = MSG.placeholder,
  user,
  userAddress,
  renderAvatar = defaultRenderAvatar,
  skillId,
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
          {renderAvatar(userAddress, user, colonyAddress, skillId)}
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
