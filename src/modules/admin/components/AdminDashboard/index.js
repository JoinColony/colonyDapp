/* @flow */

import compose from 'recompose/compose';

import { withFeatureFlags, withImmutablePropsToJS } from '~utils/hoc';

import { withColonyFromRoute } from '../../../dashboard/hocs';

import AdminDashboard from './AdminDashboard.jsx';

export default compose(
  withColonyFromRoute,
  withFeatureFlags(),
  withImmutablePropsToJS,
)(AdminDashboard);
