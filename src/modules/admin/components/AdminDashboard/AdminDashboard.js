/* @flow */

import compose from 'recompose/compose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withFeatureFlags } from '~utils/hoc';

import AdminDashboard from './AdminDashboard.jsx';

export default compose(
  withFeatureFlags(),
  withImmutablePropsToJS,
)(AdminDashboard);
