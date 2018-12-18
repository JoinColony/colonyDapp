/* @flow */

import React, { Component } from 'react';

import NavLink from '../NavLink';
import UserAvatarDisplay from './UserAvatarDisplay.jsx';

import type { Props as UserAvatarProps } from './UserAvatarDisplay.jsx';
import type { UserRecord } from '~immutable';

type Props = UserAvatarProps & {
  user?: UserRecord,
  avatarData?: string,
  link?: boolean,
  fetchUserAvatar: (hash: string) => void,
};

class UserAvatar extends Component<Props> {
  static displayName = 'UserAvatar';

  componentDidMount() {
    const { avatarData, user, fetchUserAvatar } = this.props;
    if (user && user.isReady && user.profile.avatar && !avatarData)
      fetchUserAvatar(user.profile.avatar);
  }

  render() {
    const { avatarData, link, username } = this.props;
    return link && username ? (
      <NavLink to={`/user/${username.toLowerCase()}`}>
        <UserAvatarDisplay {...this.props} avatar={avatarData} />
      </NavLink>
    ) : (
      <UserAvatarDisplay {...this.props} avatar={avatarData} />
    );
  }
}

export default UserAvatar;
