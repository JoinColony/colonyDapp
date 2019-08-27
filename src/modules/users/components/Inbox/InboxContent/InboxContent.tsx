import React from 'react';
import { List } from 'immutable';
import { defineMessages, FormattedMessage } from 'react-intl';
import { InboxItemRecordType } from '~immutable/InboxItem';

import { ActionTypes } from '~redux/index';
import { useAsyncFunction, useDataFetcher } from '~utils/hooks';
import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { DotsLoader } from '~core/Preloaders';
import CenteredTemplate from '~pages/CenteredTemplate';
import { inboxItemsFetcher } from '../../../fetchers';
import InboxItem from '../InboxItem';

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

const allReadActions = {
  submit: ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ,
  success: ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
  error: ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ_ERROR,
};

const InboxContent = () => {
  const markAllRead = useAsyncFunction(allReadActions);
  const { data: inboxItems } = useDataFetcher<List<InboxItemRecordType>>(
    inboxItemsFetcher,
    [],
    [],
  );

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
          {inboxItems ? (
            <Table scrollable appearance={{ separators: 'borders' }}>
              <TableBody>
                {inboxItems.map(activity => (
                  <InboxItem key={activity.id} activity={activity} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className={styles.loadingText}>
              <FormattedMessage {...MSG.loadingInbox} />
              <DotsLoader />
            </div>
          )}
        </div>
      </div>
    </CenteredTemplate>
  );
};

InboxContent.displayName = displayName;

export default InboxContent;
