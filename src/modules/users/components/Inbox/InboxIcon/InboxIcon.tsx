import { MessageDescriptor, defineMessages } from 'react-intl';
import React from 'react';

import { useSelector } from '~utils/hooks';
import { inboxItemsSelector } from '../../../selectors';

import Icon from '~core/Icon';

import styles from './InboxIcon.css';

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

const InboxIcon = ({ title = MSG.fallbackTitle }: Props) => {
  const { record: activities = [] } = useSelector(inboxItemsSelector);
  const hasUnreadActivities = activities.some(activity => activity.unread);
  return (
    <span
      className={hasUnreadActivities ? styles.inboxNotification : undefined}
    >
      <Icon name="envelope" title={title} />
    </span>
  );
};

InboxIcon.displayName = displayName;

export default InboxIcon;
