/* @flow */

import { connect } from 'react-redux';

import UserProfile from './UserProfile.jsx';

import { fetchUserProfile } from '../../actionCreators';

import { isLoading, targetUserId, targetUserProfile } from '../../selectors';

const mapStateToProps = (state, ownProps) => ({
  isLoading: isLoading(state),
  targetUserId: targetUserId(state, ownProps),
  targetUserProfile: targetUserProfile(state, ownProps),
});

const mapDispatchToProps = {
  fetchUserProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfile);
