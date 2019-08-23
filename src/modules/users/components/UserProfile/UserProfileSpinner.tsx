import React from 'react';
import { defineMessages } from 'react-intl';

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

const Spinner = () => <LoadingTemplate loadingText={MSG.loadingText} />;

export default Spinner;
