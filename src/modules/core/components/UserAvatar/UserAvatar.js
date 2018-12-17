/* @flow */

import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import UserAvatar from './UserAvatar.jsx';

import { withUser } from '../../../users/composers';
import { avatarSelector } from '../../../users/selectors';
import { fetchUserAvatar as fetchUserAvatarAction } from '../../../users/actionCreators';

export default compose(
  withUser,
  connect(
    (state, props) => ({
      avatarData: avatarSelector(state, props),
    }),
    { fetchUserAvatar: fetchUserAvatarAction },
  ),
  lifecycle({
    componentDidMount() {
      const { avatarData, user, fetchUserAvatar } = this.props;
      if (
        user &&
        user.fetching === 0 &&
        user.data.profile.avatar &&
        !avatarData
      )
        fetchUserAvatar(user.data.profile.avatar);
    },
  }),
)(UserAvatar);
