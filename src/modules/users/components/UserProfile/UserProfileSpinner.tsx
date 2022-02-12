import React from 'react';
import { defineMessages } from 'react-intl';

import LoadingTemplate from '~pages/LoadingTemplate';
import { useLoggedInUser } from '~data/index';

const MSG = defineMessages({
  loadingText: {
    id: 'ViewUserProfile.UserProfile.loadingText',
    defaultMessage: 'Fetching user profile from server',
  },
  loadingTextDecentralized: {
    id: 'ViewUserProfile.UserProfile.loadingText',
    defaultMessage: 'Fetching user profile from contracts',
  },
  loaderDescription: {
    id: 'ViewUserProfile.UserProfile.loaderDescription',
    defaultMessage: 'Please wait while this user profile is being fetched.',
  },
});

const Spinner = () => {
  const { decentralized } = useLoggedInUser();
  return (
    <LoadingTemplate
      loadingText={
        decentralized ? MSG.loadingTextDecentralized : MSG.loadingText
      }
    />
  );
};

export default Spinner;
