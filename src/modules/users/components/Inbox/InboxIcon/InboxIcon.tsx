import { MessageDescriptor, defineMessages } from 'react-intl';
import React from 'react';

import Icon from '~core/Icon';
import { Notifications } from '~data/index';

import styles from './InboxIcon.css';

const MSG = defineMessages({
  fallbackTitle: {
    id: 'users.Inbox.InboxIcon.fallbackTitle',
    defaultMessage: 'Go to Inbox',
  },
});

interface Props {
  notifications: Notifications;
  activeClassName?: string;
  title?: MessageDescriptor;
}

const displayName = 'users.Inbox.InboxIcon';

const InboxIcon = ({ title = MSG.fallbackTitle, notifications }: Props) => {
  const hasUnreadNotifications = notifications.some(
    notification => !notification.read,
  );
  return (
    <span
      className={hasUnreadNotifications ? styles.inboxNotification : undefined}
    >
      <Icon name="envelope" title={title} />
    </span>
  );
};

InboxIcon.displayName = displayName;

export default InboxIcon;
