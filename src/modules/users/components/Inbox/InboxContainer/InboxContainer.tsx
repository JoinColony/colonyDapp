import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { INBOX_ROUTE } from '~routes/index';
import { useSelector } from '~utils/hooks';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { SpinnerLoader } from '~core/Preloaders';
import { Table, TableBody } from '~core/Table';
import NavLink from '~core/NavLink';
import { EVENT_SOURCE_TYPES } from '~data/types/index';
import { useMarkAllNotificationsAsReadMutation } from '~data/index';

import { ChainInboxItem, InboxItem } from '../InboxItem';
import { inboxItemsSelector } from '../../../selectors';

import styles from './InboxContainer.css';

const displayName = 'users.Inbox.InboxContainer';

interface Props {
  full?: boolean;
  close?: () => void;
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

const InboxContainer = ({ full, close }: Props) => {
  const { record: inboxItems, isFetching } = useSelector(inboxItemsSelector);
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const hasInboxItems = !!(
    inboxItems &&
    inboxItems.length &&
    inboxItems.length > 0
  );
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
            inboxItems: hasInboxItems ? inboxItems.length : 0,
          }}
        />
        <Button
          appearance={{ theme: 'blue' }}
          text={MSG.markAllAsRead}
          onClick={markAllAsRead}
          disabled={!hasInboxItems || isFetching}
        />
      </div>
      <div
        className={
          full ? styles.inboxContainerFull : styles.inboxContainerPopover
        }
      >
        {hasInboxItems && !isFetching && (
          <Table scrollable appearance={{ separators: 'borders' }}>
            <TableBody>
              {inboxItems.map(item =>
                item.sourceType === EVENT_SOURCE_TYPES.DB ? (
                  <InboxItem full={full} key={item.id} item={item} />
                ) : (
                  <ChainInboxItem full={full} key={item.id} item={item} />
                ),
              )}
            </TableBody>
          </Table>
        )}

        {!hasInboxItems && isFetching && (
          <div className={!full ? styles.emptyPopoverPlaceholder : undefined}>
            <SpinnerLoader
              loadingText={MSG.loadingInbox}
              appearance={{ size: 'massive', theme: 'primary' }}
            />
          </div>
        )}
        {!hasInboxItems && !isFetching && (
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
