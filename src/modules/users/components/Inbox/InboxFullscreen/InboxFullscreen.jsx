/* @flow */

import React from 'react';

import CenteredTemplate from '~pages/CenteredTemplate';
import InboxContainer from '../InboxContainer';

const displayName = 'users.Inbox.InboxFullscreen';

const InboxFullscreen = () => (
  <CenteredTemplate appearance={{ theme: 'alt' }}>
    <InboxContainer full />
  </CenteredTemplate>
);

InboxFullscreen.displayName = displayName;

export default InboxFullscreen;
