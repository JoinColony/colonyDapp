/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import { Data } from '~immutable';

import { userSelector, currentUser as currentUserSelector } from '../selectors';
import { fetchUserProfile } from '../actionCreators';
import fetchMissingUser from './fetchMissingUser';

/**
 * With `username` in props, fetch the user and provide
 * as `user`.
 */
const withUser = compose(
  connect(
    (state, props) => ({
      user: userSelector(state, props),
      currentUser: currentUserSelector(state),
    }),
    { fetchUserProfile },
  ),
  mapProps(props => {
    const { currentUser, username, user } = props;
    return {
      ...props,
      user:
        currentUser.profile.username === username
          ? // use `Data` so this can be treated the same as `user`
            Data({ record: currentUser })
          : user,
    };
  }),
  fetchMissingUser,
);

export default withUser;
