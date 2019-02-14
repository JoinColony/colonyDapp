/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import { Table, TableBody } from '~components/core/Table';
import Heading from '~components/core/Heading';
import Button from '~components/core/Button';

import InboxItem from './InboxItem.jsx';

import CenteredTemplate from '~components/pages/CenteredTemplate';

import mockInbox from './__datamocks__/mockInbox';

import styles from './Inbox.css';

import type { InboxElement } from './types';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Inbox.title',
    defaultMessage: 'Inbox',
  },
  markAllRead: {
    id: 'dashboard.Inbox.markAllRead',
    defaultMessage: 'Mark all as read',
  },
});

const displayName = 'dashboard.Inbox';

const sortItems = items =>
  items
    // sort by date, newest first
    .sort((a, b) => b.createdAt - a.createdAt)
    // set `type` to first word of camelCase event type
    // either `action` or `notification`
    .map(item => ({ ...item, type: item.event.split(/[A-Z]/)[0] }))
    // move unread `action` events to front
    .sort((a, b) => {
      if (a.unread && a.type === 'action' && (b.type !== 'action' || !b.unread))
        return -1;
      if (b.unread && b.type === 'action' && (a.type !== 'action' || !a.unread))
        return 1;
      return 0;
    });

const Inbox = ({
  inboxItems,
  markAsRead,
  markAllRead,
}: {
  inboxItems: Array<InboxElement>,
  markAsRead: (id: number) => void,
  markAllRead: () => void,
}) => (
  <CenteredTemplate appearance={{ theme: 'alt' }}>
    <div className={styles.contentContainer}>
      <div className={styles.inboxHeading}>
        <Heading
          appearance={{ size: 'medium', margin: 'small' }}
          text={MSG.title}
        />
        <Button
          appearance={{ theme: 'blue' }}
          text={MSG.markAllRead}
          onClick={markAllRead}
        />
      </div>
      <div className={styles.inboxContainer}>
        <Table scrollable appearance={{ separators: 'borders' }}>
          <TableBody>
            {inboxItems.map(item => (
              <InboxItem key={item.id} item={item} markAsRead={markAsRead} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </CenteredTemplate>
);

Inbox.displayName = displayName;

// To be replaced with e.g. react-redux connect()
class MockInbox extends Component<{}, { inboxItems: Array<InboxElement> }> {
  state = {
    inboxItems: mockInbox,
  };

  componentDidMount() {
    this.setState(({ inboxItems }) => ({ inboxItems: sortItems(inboxItems) }));
  }

  markAsRead = (id: number) =>
    this.setState(prev => {
      const { inboxItems } = prev;
      const found = inboxItems.find(item => item.id === id);
      if (found) found.unread = false;
      return { inboxItems };
    });

  markAllRead = () =>
    this.setState(prev => {
      const { inboxItems } = prev;
      return {
        inboxItems: inboxItems.map(item => ({ ...item, unread: false })),
      };
    });

  render() {
    const { inboxItems } = this.state;
    const { markAsRead, markAllRead } = this;
    return (
      <Inbox
        inboxItems={inboxItems}
        markAsRead={markAsRead}
        markAllRead={markAllRead}
      />
    );
  }
}

export default MockInbox;
