/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import { Data } from '~immutable';

import {
  userSelector,
  userFromAddressSelector,
  currentUser as currentUserSelector,
} from '../selectors';
import { fetchUserProfile } from '../actionCreators';
import fetchMissingUser from './fetchMissingUser';

/**
 * With either `username` or `userAddress` in props, fetch the user and provide
 * as `user`.
 */
const withUser = compose(
  connect(
    (state, props) => ({
      user: userSelector(state, props),
      userFromAddress: userFromAddressSelector(state, props),
      currentUser: currentUserSelector(state),
    }),
    { fetchUserProfile },
  ),
  mapProps(props => {
    const { currentUser, username, user, userFromAddress } = props;
    return {
      ...props,
      user:
        currentUser.profile.username === username
          ? // use `Data` so this can be treated the same as `user`
            Data({ record: currentUser })
          : user || userFromAddress,
    };
  }),
  fetchMissingUser,
);

export default withUser;
