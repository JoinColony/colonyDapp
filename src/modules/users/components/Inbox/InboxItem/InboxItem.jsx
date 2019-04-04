/* @flow */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import TimeRelative from '~core/TimeRelative';
import { TableRow, TableCell } from '~core/Table';
import Numeral from '~core/Numeral';
import Button from '~core/Button';
import { DialogLink } from '~core/Dialog';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';

import type { Node } from 'react';

import MSG from '../messages';
import type { InboxElement } from '../types';

import styles from './InboxItem.css';

import { mockTask } from '../Task/__datamocks__/mockTask';

import MSG from '../messages';

const UserAvatar = HookedUserAvatar();

const LOCAL_MSG = defineMessages({
  loadingText: {
    id: 'users.Inbox.InboxItem.loadingText',
    defaultMessage: 'Loading message',
  },
});

const displayName = 'users.Inbox.InboxItem';

type Props = {|
  activity: InboxElement,
  markAsRead: (id: string) => void,
|};

const makeInboxDetail = (value: any, formatFn?: (value: any) => any) =>
  value ? (
    <span className={styles.inboxDetail}>
      {formatFn ? formatFn(value) : value}
    </span>
  ) : null;

// const getType = (event: string): EventType => {
//   const type = event.split(/[A-Z]/)[0];
//   return type === 'action' || type === 'notification' ? type : 'notification';
// };

// const UnreadIndicator = ({ type }: { type: EventType }) => (
//   <div
//     className={`${styles.inboxUnread} ${
//       type === 'action'
//         ? styles.inboxUnreadAction
//         : styles.inboxUnreadNotification
//     }`}
//   />
// );

const getTask = () => mockTask;

/* Some inbox items link somewhere, others open a modal so it's important to differentiate here */
const ConditionalWrapper = ({
  to,
  children,
  event,
  user,
}: {
  to?: string,
  children: Node,
  event: string,
  user?: {},
}) => {
  // TODO: Make this happen dynamically, we can't create a condition for each inbox event
  if (event === 'actionWorkerInviteReceived') {
    const details = getTask();
    return (
      <DialogLink
        to="TaskInviteDialog"
        props={{
          assignee: { profile: user },
          task: details,
        }}
      >
        {({ open }) => (
          <Button className={styles.noStyleButton} onClick={open}>
            <div className={styles.inboxDetails}>{children}</div>
          </Button>
        )}
      </DialogLink>
    );
  }
  if (to) {
    return (
      <Link to={to} className={styles.fullWidthLink}>
        <div className={styles.inboxDetails}>{children}</div>
      </Link>
    );
  }
  return <div className={styles.inboxDetails}>{children}</div>;
};

const InboxItem = ({
  activity: {
    /*
     * @TODO Handle read/unread notifications
     */
    // unread,
    otherUser,
    amount,
    colony,
    comment,
    timestamp,
    domainName,
    event,
    task,
    user: address,
    onClickRoute,
  },
}: Props) => {
  const args = [address];
  const { data: user, isFetching } = useDataFetcher<UserType>(
    userFetcher,
    args,
    args,
    { ttl: 1000 * 30 }, // 30 seconds
  );
  const { walletAddress, username } = user.profile;
  return (
    <TableRow
      className={styles.inboxRow}
      /*
       * @TODO Handle read/unread notifications
       */
      // onClick={() => unread && markAsRead(id)}
    >
      <TableCell className={styles.inboxRowCell}>
        {isFetching ? (
          <div className={styles.spinnerWrapper}>
            <SpinnerLoader
              loadingText={LOCAL_MSG.loadingText}
              appearance={{ theme: 'primary', size: 'medium' }}
            />
          </div>
        ) : (
          <ConditionalWrapper to={onClickRoute} event={event} user={user}>
            {/*
             * @TODO Handle read/unread notifications
             */}
            {/* {unread && <UnreadIndicator type={getType(event)} />} */}
            {user && (
              <UserAvatar
                size="xxs"
                address={walletAddress}
                username={username}
                className={styles.userAvatar}
              />
            )}

            <span className={styles.inboxAction}>
              <FormattedMessage
                {...MSG[event]}
                values={{
                  amount: makeInboxDetail(amount, ({ unit, value }) => (
                    <Numeral prefix={unit} value={value} />
                  )),
                  colony: makeInboxDetail(colony),
                  comment: makeInboxDetail(comment),
                  domain: makeInboxDetail(domainName),
                  other: makeInboxDetail(otherUser),
                  task: makeInboxDetail(task),
                  time: makeInboxDetail(timestamp, value => (
                    <TimeRelative value={value} />
                  )),
                  user: makeInboxDetail(username),
                }}
              />
            </span>

            <span className={styles.additionalDetails}>
              {colony && domainName && (
                <FormattedMessage
                  {...MSG.metaColonyAndDomain}
                  values={{
                    colony,
                    domain: domainName,
                  }}
                />
              )}
              {colony && !domainName && (
                <FormattedMessage
                  {...MSG.metaColonyOnly}
                  values={{
                    colony,
                  }}
                />
              )}

              {amount && (
                <span>
                  <span className={styles.pipe}>|</span>
                  <span className={styles.amount}>
                    {amount.unit} {amount.value}
                  </span>
                </span>
              )}

              {(colony || amount) && <span className={styles.pipe}>|</span>}
              <span className={styles.time}>
                <TimeRelative value={timestamp} />
              </span>
            </span>
          </ConditionalWrapper>
        )}
      </TableCell>
    </TableRow>
  );
};

InboxItem.displayName = displayName;

export default InboxItem;
