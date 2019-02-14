/* @flow */

import React from 'react';

import NavLink from '../NavLink';
import UserAvatarDisplay from './UserAvatarDisplay.jsx';

import type { Props as UserAvatarProps } from './UserAvatarDisplay.jsx';
import type { DataType, UserType } from '~immutable';

type Props = {|
  ...UserAvatarProps,
  user?: DataType<UserType>,
  avatarData?: string,
  link?: boolean,
|};

const UserAvatar = ({ avatarData, link, username, user, ...rest }: Props) => {
  if (!user || !user.record)
    return (
      <UserAvatarDisplay
        username={username}
        walletAddress=""
        notSet
        {...rest}
      />
    );

  const { displayName, walletAddress } = user.record.profile;
  return link && username ? (
    <NavLink to={`/user/${username.toLowerCase()}`}>
      <UserAvatarDisplay
        avatar={avatarData}
        displayName={displayName}
        walletAddress={walletAddress}
        {...rest}
      />
    </NavLink>
  ) : (
    <UserAvatarDisplay
      avatar={avatarData}
      displayName={displayName}
      walletAddress={walletAddress}
      {...rest}
    />
  );
};

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
