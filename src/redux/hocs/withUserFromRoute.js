/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { fetchUserProfile } from '../actionCreators';
import { routerUserSelector, usernameFromRouter } from '../selectors';

import fetchMissingUser from './fetchMissingUser';

import type { RootStateRecord } from '~immutable';

const withUserFromRoute = compose(
  connect(
    (state: RootStateRecord, props: *) => ({
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
