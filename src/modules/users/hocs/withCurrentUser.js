/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withImmutablePropsToJS } from '~utils/hoc';

import { currentUserSelector } from '../selectors';

const withCurrentUser = compose(
  connect(state => ({
    currentUser: currentUserSelector(state),
  })),
  withImmutablePropsToJS,
);

export default withCurrentUser;
