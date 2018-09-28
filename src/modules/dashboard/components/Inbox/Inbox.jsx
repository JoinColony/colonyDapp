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

type Props = {
  // TODO: type better as soon as actual structure is known
  items: Array<Object>,
};

const Inbox = ({ items }: Props) => (
  <ProfileTemplate>
    <div className={styles.inboxContainer}>
      <Heading
        appearance={{ size: 'medium', margin: 'small' }}
        text={MSG.title}
      />
      <Table scrollable>
        <TableBody>
          {mockInbox.map(item => (
            <InboxItem key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  </ProfileTemplate>
);

Inbox.displayName = displayName;

export default Inbox;
