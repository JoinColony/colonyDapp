/* @flow */

import { connect } from 'react-redux';

import UserProfile from './UserProfile.jsx';

import { USER_PROFILE_FETCH } from '../../actionTypes';

const mapStateToProps = (state, ownProps) => ({
  isLoading: state.user.userProfiles.isLoading,
  isError: state.user.userProfiles.isError,
  targetUserId: ownProps.match.params.userId,
  targetProfile: state.user.userProfiles[ownProps.match.params.userId],
});

const mapDispatchToProps = dispatch => ({
  fetchUserProfile: username => {
    dispatch({ type: USER_PROFILE_FETCH, payload: username });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfile);
