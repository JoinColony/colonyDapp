/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import InboxItem from './InboxItem.jsx';

import ProfileTemplate from '../../../pages/ProfileTemplate';

import mockInbox from './__datamocks__/mockInbox';

import styles from './Inbox.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Inbox.Inbox.title',
    defaultMessage: 'Inbox',
  },
});

const displayName = 'dashboard.Inbox';

const Inbox = () => (
  <div className={styles.templateContainer}>
    <ProfileTemplate>
      <Heading
        appearance={{ size: 'medium', margin: 'small' }}
        text={MSG.title}
      />
      <div className={styles.inboxContainer}>
        <Table scrollable appearance={{ separators: 'borders' }}>
          <TableBody>
            {mockInbox.map(item => (
              <InboxItem key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      </div>
    </ProfileTemplate>
  </div>
);

Inbox.displayName = displayName;

export default Inbox;
