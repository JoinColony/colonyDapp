/* @flow */

import { connect } from 'react-redux';

import UserProfile from './UserProfile.jsx';

import { fetchUserProfile } from '../../actionCreators';

import { usernameFromRouter, routerUserSelector } from '../../selectors';

const mapStateToProps = (state, props) => ({
  username: usernameFromRouter(state, props),
  user: routerUserSelector(state, props),
});

const mapDispatchToProps = {
  fetchUserProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfile);
