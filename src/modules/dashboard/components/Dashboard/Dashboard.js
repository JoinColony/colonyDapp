/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { withImmutablePropsToJS } from '~utils/hoc';

import Dashboard from './Dashboard.jsx';

import { currentUserSelector } from '../../../users/selectors';

const enhance = compose(
  connect(
    state => ({
      currentUser: currentUserSelector(state),
    }),
    null,
  ),
  withImmutablePropsToJS,
);

export default enhance(Dashboard);
