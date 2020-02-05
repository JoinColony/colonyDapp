import React from 'react';

import CenteredTemplate from '~pages/CenteredTemplate';
import { SpinnerLoader } from '~core/Preloaders';
import { useUserNotificationsQuery, useLoggedInUser } from '~data/index';

import InboxContainer from '../InboxContainer';

const displayName = 'users.Inbox.InboxFullscreen';

const InboxFullscreen = () => {
  const { walletAddress } = useLoggedInUser();
  const { data, loading } = useUserNotificationsQuery({
    variables: { address: walletAddress },
  });

  const notifications = (data && data.user && data.user.notifications) || [];

  return (
    <CenteredTemplate appearance={{ theme: 'alt' }}>
      {loading ? (
        <SpinnerLoader appearance={{ size: 'small' }} />
      ) : (
        <InboxContainer full notifications={notifications} />
      )}
    </CenteredTemplate>
  );
};

InboxFullscreen.displayName = displayName;

export default InboxFullscreen;
