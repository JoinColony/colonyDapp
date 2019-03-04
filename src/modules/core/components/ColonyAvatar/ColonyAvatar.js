/* @flow */

import compose from 'recompose/compose';

import { withImmutablePropsToJS } from '~utils/hoc';

import ColonyAvatar from './ColonyAvatar.jsx';

import { withColonyAvatar } from '../../../dashboard/hocs';

export default compose(
  withColonyAvatar,
  withImmutablePropsToJS,
)(ColonyAvatar);
