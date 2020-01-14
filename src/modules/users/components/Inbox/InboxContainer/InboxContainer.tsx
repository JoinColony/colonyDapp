import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { INBOX_ROUTE } from '~routes/index';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { SpinnerLoader } from '~core/Preloaders';
import { Table, TableBody } from '~core/Table';
import NavLink from '~core/NavLink';
import {
  useLoggedInUser,
  useMarkAllNotificationsAsReadMutation,
  Notifications,
  UserNotificationsDocument,
} from '~data/index';

import { InboxItem } from '../InboxItem';

import styles from './InboxContainer.css';

const displayName = 'users.Inbox.InboxContainer';

interface Props {
  close?: () => void;
  full?: boolean;
  notifications: Notifications;
}

const MSG = defineMessages({
  loadingInbox: {
    id: 'users.Inbox.InboxContainer.loadingInbox',
    defaultMessage: 'Loading...',
  },
  title: {
    id: 'users.Inbox.InboxContainer.title',
    defaultMessage: `Inbox {hasInboxItems, select,
      true { ({inboxItems})}
      other {}
    }`,
  },
  markAllAsRead: {
    id: 'users.Inbox.InboxContainer.markAllAsRead',
    defaultMessage: 'Mark all as read',
  },
  seeAll: {
    id: 'users.Inbox.InboxContainer.seeAll',
    defaultMessage: 'See All',
  },
  noItems: {
    id: 'users.Inbox.InboxContainer.noItems',
    defaultMessage: `It looks like you don't have any notifications.
Don't worry, we'll let you know when anything important happens.`,
  },
});

const InboxContainer = ({ full, close, notifications }: Props) => {
  const { walletAddress } = useLoggedInUser();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation({
    refetchQueries: [
      {
        query: UserNotificationsDocument,
        variables: { address: walletAddress },
      },
    ],
  });

  const hasInboxItems = notifications.length > 0;
  return (
    <div
      className={
        full ? styles.contentContainerFull : styles.contentContainerPopup
      }
    >
      <div
        className={full ? styles.inboxHeadingFull : styles.inboxHeadingPopover}
      >
        <Heading
          appearance={{ size: 'medium', margin: 'small' }}
          text={MSG.title}
          textValues={{
            hasInboxItems,
            inboxItems: hasInboxItems ? notifications.length : 0,
          }}
        />
        <Button
          appearance={{ theme: 'blue' }}
          text={MSG.markAllAsRead}
          onClick={markAllAsRead}
          disabled={!hasInboxItems}
        />
      </div>
      <div
        className={
          full ? styles.inboxContainerFull : styles.inboxContainerPopover
        }
      >
        {hasInboxItems && (
          <Table scrollable appearance={{ separators: 'borders' }}>
            <TableBody>
              {notifications.map(item => (
                <InboxItem full={full} key={item.id} item={item} />
              ))}
            </TableBody>
          </Table>
        )}

        {!notifications && (
          <div className={!full ? styles.emptyPopoverPlaceholder : undefined}>
            <SpinnerLoader
              loadingText={MSG.loadingInbox}
              appearance={{ size: 'massive', theme: 'primary' }}
            />
          </div>
        )}
        {!hasInboxItems && (
          <div className={!full ? styles.emptyPopoverPlaceholder : undefined}>
            <div className={styles.emptyText}>
              <FormattedMessage {...MSG.noItems} />
            </div>
          </div>
        )}
        {!full && (
          <div className={styles.inboxFooter}>
            <NavLink to={INBOX_ROUTE}>
              <Button
                appearance={{ theme: 'blue' }}
                text={MSG.seeAll}
                onClick={close}
              />
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

InboxContainer.displayName = displayName;

export default InboxContainer;
