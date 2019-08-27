/* @flow */

import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

// import { INBOX_ROUTE } from '~routes';

import { useSelector, useAsyncFunction } from '~utils/hooks';
import { ACTIONS } from '~redux';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { DotsLoader } from '~core/Preloaders';
import { Table, TableBody } from '~core/Table';

import InboxItem from '../InboxItem';

import { inboxItemsSelector } from '../../../selectors';

import styles from './InboxContainer.css';

const displayName = 'users.Inbox.InboxContainer';

// Link to fullscreen for later
/* <NavLink
to={INBOX_ROUTE}
className={hasUnreadActivities ? styles.inboxIconWCircle : styles.inboxIcon}
activeClassName={activeClassName}

>
</NavLink>
*/

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
});

const allReadActions = {
  submit: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ,
  success: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
  error: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ_ERROR,
};

const InboxContainer = ({ full }) => {
  const inboxItems = useSelector(inboxItemsSelector);
  const markAllRead = useAsyncFunction(allReadActions);
  return (
    <div
      className={
        full ? styles.contentContainerFull : styles.contentContainerPopup
      }
    >
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
              {inboxItems.map(activity => (
                <InboxItem key={activity.id} activity={activity} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

InboxContainer.displayName = displayName;

export default InboxContainer;
