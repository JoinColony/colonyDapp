/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { currentUserSelector } from '../selectors';

const withCurrentUser = compose(
  connect(
    state => ({
      currentUser: currentUserSelector(state),
    }),
    null,
  ),
);

export default withCurrentUser;
