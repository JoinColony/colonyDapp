import { MessageDescriptor, defineMessages } from 'react-intl';
import React from 'react';

import Icon from '~core/Icon';

const MSG = defineMessages({
  fallbackTitle: {
    id: 'users.Inbox.InboxIcon.fallbackTitle',
    defaultMessage: 'Go to Inbox',
  },
});

interface Props {
  activeClassName?: string;
  title?: MessageDescriptor;
}

const displayName = 'users.Inbox.InboxIcon';

const InboxIcon = ({ title = MSG.fallbackTitle }: Props) => (
  <Icon name="envelope" title={title} />
);

InboxIcon.displayName = displayName;

export default InboxIcon;
