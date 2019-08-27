import { MessageDescriptor, defineMessages } from 'react-intl';
import React from 'react';

import { INBOX_ROUTE } from '~routes/index';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';
import { useSelector } from '~utils/hooks';
import { inboxItemsSelector } from '../../../selectors';

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

const InboxIcon = ({ activeClassName, title = MSG.fallbackTitle }: Props) => {
  const { record: activities = [] } = useSelector(inboxItemsSelector);
  const hasUnreadActivities = activities.some(activity => activity.unread);
  return (
    <NavLink
      to={INBOX_ROUTE}
      className={
        hasUnreadActivities ? styles.inboxIconWCircle : styles.inboxIcon
      }
      activeClassName={activeClassName}
    >
      <Icon name="envelope" title={title} />
    </NavLink>
  );
};

InboxIcon.displayName = displayName;

export default InboxIcon;
