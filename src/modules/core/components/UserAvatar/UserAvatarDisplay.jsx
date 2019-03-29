/* @flow */

import React from 'react';

import type { $Pick } from '~types';

import Avatar from '~core/Avatar';
import UserInfo from '~core/UserInfo';

import getIcon from '../../../../lib/identicon';
import type { Props as UserAvatarProps } from './UserAvatarFactory.jsx';

type Props = {
  ...$Pick<
    UserAvatarProps,
    { className?: *, notSet?: *, size?: *, user?: *, address: * },
  >,
  /** Avatar image URL (can be a base64 encoded string) */
  avatar?: ?string,
  /** Whether to show or not show the UserInfo tooltip over the avatar */
  showInfo?: boolean,
};

/*
 * `displayName` is a prop name, so we'll use `componentDisplayName` here
 */
const componentDisplayName = 'UserAvatarDisplay';

const UserAvatarDisplay = ({
  address,
  avatar,
  className,
  showInfo,
  notSet,
  size,
  user,
}: Props) => (
  <UserInfo trigger={showInfo ? 'hover' : 'disabled'} user={user}>
    <Avatar
      avatarURL={avatar || (!notSet ? getIcon(address) : null)}
      className={className}
      notSet={notSet}
      placeholderIcon="circle-person"
      size={size}
      title={(user && user.profile.username) || address}
    />
  </UserInfo>
);

UserAvatarDisplay.displayName = componentDisplayName;

export default UserAvatarDisplay;
