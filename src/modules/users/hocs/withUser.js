/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import { DataRecord } from '~immutable';

import { currentUserSelector, userByAddressSelector } from '../selectors';
import { userFetch } from '../actionCreators';
import fetchMissingUser from './fetchMissingUser';

// TODO replace the remaining use of this (TransactionListItem) with hooks
// When replacing this, fetch `currentUser` separately
/*
 * With `address` in props, fetch the user and provide it as `user`,
 * and also fetch the current user.
 */
const withUser = compose(
  connect(
    (state, props) => ({
      currentUser: currentUserSelector(state),
      user: userByAddressSelector(state, props),
    }),
    { userFetch },
  ),
  mapProps(props => {
    const { currentUser, address, user } = props;
    return {
      ...props,
      user:
        currentUser.getIn(['profile', 'walletAddress']) === address
          ? // use `Data` so this can be treated the same as `user`
            DataRecord({ record: currentUser })
          : user,
    };
  }),
  fetchMissingUser,
);

export default withUser;
