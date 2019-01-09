/* @flow */

import React, { Component } from 'react';

import NavLink from '../NavLink';
import UserAvatarDisplay from './UserAvatarDisplay.jsx';

import type { Props as UserAvatarProps } from './UserAvatarDisplay.jsx';
import type { DataRecord, UserRecord } from '~immutable';

type Props = UserAvatarProps & {
  user?: DataRecord<UserRecord>,
  avatarData?: string,
  link?: boolean,
  fetchUserAvatar: (hash: string) => void,
};

class UserAvatar extends Component<Props> {
  static displayName = 'UserAvatar';

  componentDidMount() {
    const { avatarData, user, fetchUserAvatar } = this.props;
    if (user && user.record && user.record.profile.avatar && !avatarData)
      fetchUserAvatar(user.record.profile.avatar);
  }

  render() {
    const { avatarData, link, username, user, ...rest } = this.props;

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
  }
}

export default UserAvatar;
