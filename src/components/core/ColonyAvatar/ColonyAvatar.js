/* @flow */

import compose from 'recompose/compose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import ColonyAvatar from './ColonyAvatar.jsx';

import { withColonyAvatar } from '~redux/hocs';

export default compose(
  withColonyAvatar,
  withImmutablePropsToJS,
)(ColonyAvatar);
