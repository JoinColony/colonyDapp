/* @flow */

import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

//import { INBOX_ROUTE } from '~routes';

import { useSelector } from '~utils/hooks';
import { DotsLoader } from '~core/Preloaders';
import { Table, TableBody } from '~core/Table';

import InboxItem from '../InboxItem';

import { inboxItemsSelector } from '../../../selectors';

import styles from './InboxContainer.css';

const displayName = 'users.Inbox.InboxIcon';

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
    id: 'users.Inbox.InboxContent.loadingInbox',
    defaultMessage: 'Loading Inbox',
  },
});

const InboxContainer = () => {
  const inboxItems = useSelector(inboxItemsSelector);
  return (
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
  );
};

InboxContainer.displayName = displayName;

export default InboxContainer;
