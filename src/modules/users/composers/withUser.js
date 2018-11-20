/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import branch from 'recompose/branch';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';

import { userSelector, currentUser as currentUserSelector } from '../selectors';
import { fetchUserProfile as fetchUserProfileAction } from '../actionCreators';

const withUser = compose(
  connect(
    (state, props) => ({
      user: userSelector(state, props),
      currentUser: currentUserSelector(state),
    }),
    { fetchUserProfile: fetchUserProfileAction },
  ),
  mapProps(props => {
    const { currentUser, username, user } = props;
    return {
      ...props,
      user: currentUser.username === username ? currentUser : user,
    };
  }),
  branch(
    ({ user }) => !user,
    lifecycle({
      componentDidMount() {
        const { username, fetchUserProfile } = this.props;
        fetchUserProfile(username);
      },
    }),
  ),
);

export default withUser;
