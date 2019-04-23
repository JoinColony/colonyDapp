/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { currentUserSelector } from '../selectors';

const withCurrentUser = compose(
  connect(state => {
    const data = currentUserSelector(state);
    return {
      currentUser: data ? data.record.toJS() : data,
    };
  }),
);

export default withCurrentUser;
