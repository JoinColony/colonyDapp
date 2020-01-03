import React from 'react';

import CenteredTemplate from '~pages/CenteredTemplate';
import { SpinnerLoader } from '~core/Preloaders';
import { useUserNotificationsQuery } from '~data/index';

import InboxContainer from '../InboxContainer';

const displayName = 'users.Inbox.InboxFullscreen';

const InboxFullscreen = () => {
  const { data } = useUserNotificationsQuery();
  return (
    <CenteredTemplate appearance={{ theme: 'alt' }}>
      {data ? (
        <InboxContainer full notifications={data.user.notifications} />
      ) : (
        <SpinnerLoader size="tiny" />
      )}
    </CenteredTemplate>
  );
};

InboxFullscreen.displayName = displayName;

export default InboxFullscreen;
