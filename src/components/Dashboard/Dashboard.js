/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import Dashboard from './Dashboard.jsx';

import { currentUser } from '~redux/selectors';

const enhance = compose(
  connect(
    state => ({
      currentUser: currentUser(state),
    }),
    null,
  ),
  withImmutablePropsToJS,
);

export default enhance(Dashboard);
