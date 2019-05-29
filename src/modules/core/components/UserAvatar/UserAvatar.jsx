/* @flow */

import React from 'react';

import type { UserType } from '~immutable';

import Avatar from '~core/Avatar';
import UserInfo from '~core/UserInfo';
import Link from '~core/NavLink';

import type { Address } from '~types';

export type Props = {|
  /** Address of the current user for identicon fallback */
  address: Address,
  /** Avatar image URL (can be a base64 encoded url string) */
  avatarURL?: string,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean,
  /** Whether to show or not show the UserInfo tooltip over the avatar */
  showInfo?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
  /** The corresponding user object if available */
  user?: UserType,
|};

const displayName = 'UserAvatar';

const UserAvatar = ({
  address,
  avatarURL,
  className,
  showInfo,
  showLink,
  notSet,
  size,
  user,
}: Props) => {
  const username = user && user.profile.username;
  const avatar = (
    <UserInfo trigger={user && showInfo ? 'hover' : 'disabled'} user={user}>
      <Avatar
        avatarURL={avatarURL}
        className={className}
        notSet={notSet}
        placeholderIcon="circle-person"
        seed={address}
        size={size}
        title={username || address}
      />
    </UserInfo>
  );
  if (showLink && username) {
    // Won't this always be lowercase?
    return <Link to={`/user/${username.toLowerCase()}`}>{avatar}</Link>;
  }
  return avatar;
};

UserAvatar.displayName = displayName;

export default UserAvatar;
