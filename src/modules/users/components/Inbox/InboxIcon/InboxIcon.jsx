/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React from 'react';

import { defineMessages } from 'react-intl';

import { INBOX_ROUTE } from '~routes';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';

import styles from './InboxIcon.css';

const MSG = defineMessages({
  fallbackTitle: {
    id: 'users.Inbox.InboxIcon.fallbackTitle',
    defaultMessage: 'Go to Inbox',
  },
});

type Props = {|
  activeClassName?: string,
  title?: MessageDescriptor,
  hasUnreadActivities: boolean,
|};

const displayName = 'users.Inbox.InboxIcon';

const Inbox = ({
  activeClassName,
  title = MSG.fallbackTitle,
  hasUnreadActivities,
}: Props) => (
  <NavLink
    to={INBOX_ROUTE}
    className={hasUnreadActivities ? styles.inboxIconWCircle : styles.inboxIcon}
    activeClassName={activeClassName}
  >
    <Icon name="envelope" title={title} />
  </NavLink>
);

Inbox.displayName = displayName;

export default Inbox;
