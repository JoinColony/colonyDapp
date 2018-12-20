/* @flow */

import { connect } from 'react-redux';
import { compose } from 'recompose';

import { fetchUserProfile } from '../actionCreators';
import { routerUserSelector, usernameFromRouter } from '../selectors';

import fetchMissingUser from './fetchMissingUser';

const withUserFromRoute = compose(
  connect(
    (state, props) => ({
      user: routerUserSelector(state, props),
      username: usernameFromRouter(state, props),
    }),
    {
      fetchUserProfile,
    },
  ),
  fetchMissingUser,
);

export default withUserFromRoute;
