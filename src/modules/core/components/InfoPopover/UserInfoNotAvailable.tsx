import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

const displayName = 'InfoPopover.UserInfoNotAvailable';

const MSG = defineMessages({
  notAvailable: {
    id: 'InfoPopover.UserInfoNotAvailable.notAvailable',
    defaultMessage: 'User data is not available or could not be loaded.',
  },
});

const UserInfoNotAvailable = () => <FormattedMessage {...MSG.notAvailable} />;

UserInfoNotAvailable.displayName = displayName;

export default UserInfoNotAvailable;
