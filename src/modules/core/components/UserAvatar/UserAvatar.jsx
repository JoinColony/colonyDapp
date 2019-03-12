/* @flow */

import React from 'react';

import { useDataFetcher } from '~utils/hooks';

import {
  userFetcher,
  userAvatarByAddressFetcher,
} from '../../../users/fetchers';

import NavLink from '../NavLink';
import UserAvatarDisplay from './UserAvatarDisplay.jsx';

import type { Props as UserAvatarProps } from './UserAvatarDisplay.jsx';
import type { UserType } from '~immutable';

type Props = {|
  ...UserAvatarProps,
  link?: boolean,
|};

const UserAvatar = ({ link, username, address, ...rest }: Props) => {
  const args = [address];
  const { data: user } = useDataFetcher<UserType>(userFetcher, args, args);
  const { data: avatarData } = useDataFetcher<string>(
    userAvatarByAddressFetcher,
    args,
    args,
  );

  if (!user)
    // TODO do we need address="" ?
    return (
      <UserAvatarDisplay username={username} address="" notSet {...rest} />
    );

  // The `username` prop is optional, so take it from the fetched user profile
  const { displayName, username: profileUsername } = user.profile;
  return link && profileUsername ? (
    <NavLink to={`/user/${profileUsername.toLowerCase()}`}>
      <UserAvatarDisplay
        address={address}
        avatar={avatarData}
        displayName={displayName}
        {...rest}
      />
    </NavLink>
  ) : (
    <UserAvatarDisplay
      address={address}
      avatar={avatarData}
      displayName={displayName}
      {...rest}
    />
  );
};

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
