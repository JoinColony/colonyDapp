/* @flow */

import React from 'react';
import { compose, lifecycle, branch, renderComponent } from 'recompose';
import { defineMessages } from 'react-intl';

import UserProfile from './UserProfile.jsx';
import LoadingTemplate from '~pages/LoadingTemplate';

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

const spinner = () => <LoadingTemplate loadingText={MSG.loadingText} />;
const withUserData = lifecycle({
  state: { loading: false },
});

const isLoading = ({ loading }) => loading;

const withSpinnerWhileLoading = branch(isLoading, renderComponent(spinner));
const enhance = compose(
  withUserData,
  withSpinnerWhileLoading,
);

// If error, show error and redirect
// If loading, show loading
// If profile info in Redux, return UserProfile

const UserProfileContainer = enhance(UserProfile);

export default UserProfileContainer;
