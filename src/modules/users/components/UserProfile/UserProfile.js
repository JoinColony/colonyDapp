/* @flow */

import React from 'react';
import {
  compose,
  lifecycle,
  branch,
  renderComponent,
  withHandlers,
  withProps,
} from 'recompose';

import { connect } from 'react-redux';
import { defineMessages } from 'react-intl';

import UserProfile from './UserProfile.jsx';
import LoadingTemplate from '~pages/LoadingTemplate';

const FETCH_USER_PROFILE = 'FETCH_USER_PROFILE';

const MSG = defineMessages({
  loadingText: {
    id: 'ViewUserProfile.UserProfile.loadingText',
    defaultMessage: 'Fetching a user profile',
  },
  loaderDescription: {
    id: 'ViewUserProfile.UserProfile.loaderDescription',
    defaultMessage: 'Please wait while this user profile is being fetched.',
  },
});

const Spinner = () => <LoadingTemplate loadingText={MSG.loadingText} />;
const withUserData = lifecycle({
  componentDidMount() {
    if (!this.props.targetProfile) {
      this.props.fetchUserProfile(this.props.targetUserId);
    }
  },
});

// TODO make this placeholder real
const isError = ({ targetProfile }) => typeof targetProfile === 'Error';
const isLoading = ({ targetProfile }) => !targetProfile;

const mapStateToProps = state => ({
  userProfiles: state.user.userProfiles,
});

const enhance = compose(
  connect(mapStateToProps),
  withProps(props => ({
    targeProfile: !!props.userProfiles[props.match.params.userId],
    targetUserId: props.match.params.userId,
  })),
  withHandlers({
    fetchUserProfile: ({ dispatch }) => username => {
      dispatch({ type: FETCH_USER_PROFILE, payload: username });
    },
  }),
  withUserData,
  branch(isError, renderComponent(Spinner)),
  branch(isLoading, renderComponent(Spinner)),
);

const UserProfileContainer = enhance(UserProfile);

export default UserProfileContainer;
