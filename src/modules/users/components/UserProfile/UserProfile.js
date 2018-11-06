/* @flow */

import { connect } from 'react-redux';

import UserProfile from './UserProfile.jsx';

import { USER_PROFILE_FETCH } from '../../actionTypes';
import {
  isLoading,
  targetUserId,
  targetUserProfile,
} from '../../selectors';

const mapStateToProps = (state, ownProps) => ({
  isLoading: isLoading(state),
  targetUserId: targetUserId(ownProps),
  targetUserProfile: targetUserProfile(state, ownProps),
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
