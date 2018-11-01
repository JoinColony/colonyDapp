/* @flow */

import { connect } from 'react-redux';

import UserProfile from './UserProfile.jsx';

import { USER_PROFILE_FETCH } from '../../actionTypes';

const mapStateToProps = (state, ownProps) => ({
  isLoading: state.user.users.isLoading,
  isError: state.user.users.isError,
  targetUserId: ownProps.match.params.userId,
  targetProfile: state.user.users[ownProps.match.params.userId],
});

const mapDispatchToProps = (dispatch: Function) => ({
  fetchUserProfile: username => {
    dispatch({ type: USER_PROFILE_FETCH, payload: { username } });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfile);
