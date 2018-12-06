/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import type { Props as UserAvatarProps } from './UserAvatarDisplay.jsx';
import type { UserRecord } from '~types';

import UserAvatarDisplay from './UserAvatarDisplay.jsx';

import { withUser } from '../../../users/composers';
import { avatarSelector } from '../../../users/selectors';
import { fetchUserAvatar as fetchUserAvatarAction } from '../../../users/actionCreators';

type Props = UserAvatarProps & {
  user?: UserRecord,
  avatarData?: string,
  fetchUserAvatar: (hash: string) => void,
};

class UserAvatar extends Component<Props> {
  componentDidMount() {
    const { avatarData, user, fetchUserAvatar } = this.props;
    if (user && user.avatar && !avatarData) fetchUserAvatar(user.avatar);
  }

  render() {
    const { avatarData } = this.props;
    return <UserAvatarDisplay {...this.props} avatar={avatarData} />;
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
