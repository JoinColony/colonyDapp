/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React from 'react';

import { defineMessages } from 'react-intl';

import { INBOX_ROUTE } from '~routes';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';

import styles from './InboxIcon.css';

/*
 * Mocked Events
 *
 * These should be added directly in here, so we won't have to deal with passing
 * down of props
 *
 * @TODO replace this with actual events, not sure where they will me from yet
 */
const mockEvents = [{ handled: true }];

const MSG = defineMessages({
  title: {
    id: 'users.Inbox.title',
    defaultMessage: 'Go to Inbox',
  },
});

type Props = {|
  events?: Array<{ handled: boolean }>,
  activeClassName?: string,
  title?: MessageDescriptor,
|};

const displayName = 'users.Inbox';

const Inbox = ({
  events = mockEvents,
  activeClassName,
  title = MSG.title,
}: Props) => {
  const unhandled = events && events.find(event => !event.handled);
  return (
    <NavLink
      to={INBOX_ROUTE}
      className={unhandled ? styles.inboxIconWCircle : styles.inboxIcon}
      activeClassName={activeClassName}
    >
      <Icon name="envelope" title={title} />
    </NavLink>
  );
};

Inbox.displayName = displayName;

export default Inbox;
