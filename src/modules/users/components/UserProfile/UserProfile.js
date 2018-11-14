/* @flow */

import { connect } from 'react-redux';

import UserProfile from './UserProfile.jsx';

import { fetchUserProfile } from '../../actionCreators';

import {
  isLoadingSelector,
  usernameFromRouter,
  userSelector,
} from '../../selectors';

const mapStateToProps = (state, props) => ({
  isLoading: isLoadingSelector(state),
  username: usernameFromRouter(state, props),
  user: userSelector(state, props),
});

const mapDispatchToProps = {
  fetchUserProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfile);
