/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import NavLink from '../NavLink';
import UserAvatarDisplay from './UserAvatarDisplay.jsx';
import { withUser } from '../../../users/composers';
import { avatarSelector } from '../../../users/selectors';
import { fetchUserAvatar as fetchUserAvatarAction } from '../../../users/actionCreators';

import type { Props as UserAvatarProps } from './UserAvatarDisplay.jsx';
import type { UserRecord } from '~immutable';

type Props = UserAvatarProps & {
  user?: UserRecord,
  avatarData?: string,
  link?: boolean,
  fetchUserAvatar: (hash: string) => void,
};

class UserAvatar extends Component<Props> {
  componentDidMount() {
    const { avatarData, user, fetchUserAvatar } = this.props;
    if (user && user.profile.avatar && !avatarData)
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

export default compose(
  withUser,
  connect(
    (state, props) => ({
      avatarData: avatarSelector(state, props),
    }),
    { fetchUserAvatar: fetchUserAvatarAction },
  ),
)(UserAvatar);
