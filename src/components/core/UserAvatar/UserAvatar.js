/* @flow */

import compose from 'recompose/compose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import UserAvatar from './UserAvatar.jsx';

import { withUser, withUserAvatar } from '~redux/hocs';

export default compose(
  withUser,
  withUserAvatar,
  withImmutablePropsToJS,
)(UserAvatar);
