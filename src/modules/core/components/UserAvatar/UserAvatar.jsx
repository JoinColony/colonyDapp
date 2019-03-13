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

const UserAvatar = ({ link, address, ...rest }: Props) => {
  const args = [address];
  const { data: user } = useDataFetcher<UserType>(userFetcher, args, args, {
    ttl: 1000 * 30, // 30 seconds
  });
  const { data: avatarData } = useDataFetcher<string>(
    userAvatarByAddressFetcher,
    args,
    args,
    { ttl: 1000 * 60 * 60 * 24 }, // one day
  );

  if (!user) return <UserAvatarDisplay address={address} notSet {...rest} />;

  // The `username` prop is optional, so take it from the fetched user profile
  const { displayName, username } = user.profile;
  return link && username ? (
    <NavLink to={`/user/${username.toLowerCase()}`}>
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
