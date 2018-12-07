/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

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
)(UserAvatar);
