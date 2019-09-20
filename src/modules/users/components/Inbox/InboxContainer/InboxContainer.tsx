import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

import { INBOX_ROUTE } from '~routes/index';

import { useSelector, useAsyncFunction } from '~utils/hooks';
import { ActionTypes } from '~redux/index';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { DotsLoader } from '~core/Preloaders';
import { Table, TableBody } from '~core/Table';
import NavLink from '~core/NavLink';

import InboxItem from '../InboxItem';

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
    defaultMessage: 'Loading Inbox',
  },
  title: {
    id: 'users.Inbox.InboxContainer.title',
    defaultMessage: 'Inbox',
  },
  markAllRead: {
    id: 'users.Inbox.InboxContainer.markAllRead',
    defaultMessage: 'Mark all as read',
  },
  seeAll: {
    id: 'users.Inbox.InboxContainer.seeAll',
    defaultMessage: 'See All',
  },
  noItems: {
    id: 'users.Inbox.InboxContainer.noItems',
    defaultMessage:
      `It looks like you don't have any notifications. Don't worry, we'll let
      you know when anything important happens.`,
  },
});

const allReadActions = {
  submit: ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ,
  success: ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
  error: ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ_ERROR,
};

const InboxContainer = ({ full, close }: Props) => {
  const { record: inboxItems, isFetching } = useSelector(inboxItemsSelector);
  const markAllRead = useAsyncFunction(allReadActions);
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
        />
        <Button
          appearance={{ theme: 'blue' }}
          text={MSG.markAllRead}
          onClick={markAllRead}
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
              {inboxItems.map(activity => (
                <InboxItem full={full} key={activity.id} activity={activity} />
              ))}
            </TableBody>
          </Table>
        )}

        {!hasInboxItems && isFetching && (
          <div className={!full && styles.emptyPopoverPlaceholder}>
            <div className={styles.loadingText}>
              <FormattedMessage {...MSG.loadingInbox} />
              <DotsLoader />
            </div>
          </div>
        )}
        {!hasInboxItems && !isFetching && (
          <div className={!full && styles.emptyPopoverPlaceholder}>
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
