/* @flow */

import React from 'react';

import type { UserType } from '~immutable';

import NavLink from '~core/NavLink';
import { useDataFetcher } from '~utils/hooks';

import {
  userAvatarByAddressFetcher,
  userFetcher,
} from '../../../users/fetchers';

import UserAvatarDisplay from './UserAvatarDisplay.jsx';

type FactoryOpts = {|
  fetchUser?: boolean,
  fetchAvatar?: boolean,
  showInfo?: boolean,
  showLink?: boolean,
|};

export type Props = {|
  /** Address of the current user for identicon fallback */
  address: string,
  /** Avatar image URL (can be a base64 encoded string) */
  avatar?: string,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
  /** The corresponding user object if available */
  user?: $Shape<UserType>,
|};

const displayName = 'UserAvatar';

const UserAvatarFactory = ({
  fetchUser = true,
  fetchAvatar = true,
  showInfo = false,
  showLink = false,
}: FactoryOpts = {}) => {
  const UserAvatar = ({
    address,
    avatar: avatarProp,
    user: userProp,
    ...rest
  }: Props) => {
    let user = userProp;
    let avatar = avatarProp;

    if (fetchUser) {
      ({ data: user } = useDataFetcher<UserType>(
        userFetcher,
        [address],
        [address],
      ));
    }
    if (fetchAvatar) {
      const avatarIpfsHash = user ? user.profile.avatar : undefined;
      ({ data: avatar } = useDataFetcher<string>(
        userAvatarByAddressFetcher,
        [address, avatarIpfsHash],
        [address, avatarIpfsHash],
      ));
    }

    if (!user)
      return (
        <UserAvatarDisplay
          address={address}
          avatar={avatar}
          showInfo={showInfo}
          {...rest}
          notSet
        />
      );

    const { username } = user.profile;
    return showLink && username ? (
      <NavLink to={`/user/${username.toLowerCase()}`}>
        <UserAvatarDisplay
          avatar={avatar}
          address={address}
          user={user}
          {...rest}
        />
      </NavLink>
    ) : (
      <UserAvatarDisplay
        avatar={avatar}
        address={address}
        user={user}
        {...rest}
      />
    );
  };

  UserAvatar.displayName = displayName;

  return UserAvatar;
};

export default UserAvatarFactory;
