/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ACTIONS } from '~redux';
import { useAsyncFunction, useSelector } from '~utils/hooks';
import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { DotsLoader } from '~core/Preloaders';
import CenteredTemplate from '~pages/CenteredTemplate';
import InboxItem from '../InboxItem';
import { inboxItemsSelector } from '../../../selectors';

import styles from './InboxContent.css';

const MSG = defineMessages({
  title: {
    id: 'users.Inbox.InboxContent.title',
    defaultMessage: 'Inbox',
  },
  markAllRead: {
    id: 'users.Inbox.InboxContent.markAllRead',
    defaultMessage: 'Mark all as read',
  },
  loadingInbox: {
    id: 'users.Inbox.InboxContent.loadingInbox',
    defaultMessage: 'Loading Inbox',
  },
});

const displayName = 'users.Inbox.InboxContent';

const InboxContent = () => {
  const allReadActions = {
    submit: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ,
    success: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
    error: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ_ERROR,
  };

  const markAllRead = useAsyncFunction({ ...allReadActions });

  const inboxItems = useSelector(inboxItemsSelector);

  return (
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
          {inboxItems.length === 0 ? (
            <div className={styles.loadingText}>
              <FormattedMessage {...MSG.loadingInbox} />
              <DotsLoader />
            </div>
          ) : (
            <Table scrollable appearance={{ separators: 'borders' }}>
              <TableBody>
                {inboxItems.reverse().map(activity => (
                  <InboxItem key={activity.id} activity={activity} />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </CenteredTemplate>
  );
};

InboxContent.displayName = displayName;

export default InboxContent;
