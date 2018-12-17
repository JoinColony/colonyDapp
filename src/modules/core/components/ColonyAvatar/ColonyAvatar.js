/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import ColonyAvatar from './ColonyAvatar.jsx';

import {
  currentColonyAvatarHashSelector,
  currentColonyAvatarDataSelector,
} from '../../selectors';
import { fetchColonyAvatar as fetchColonyAvatarAction } from '../../../dashboard/actionCreators';

export default compose(
  connect(
    (state, props) => ({
      avatarHash: currentColonyAvatarHashSelector(state, props),
      avatarData: currentColonyAvatarDataSelector(state, props),
    }),
    { fetchColonyAvatar: fetchColonyAvatarAction },
  ),
)(ColonyAvatar);
