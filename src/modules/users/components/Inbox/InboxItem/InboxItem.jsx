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
import type { InboxElement, EventType } from '../types';

import styles from './InboxItem.css';

import { mockTask } from '../Task/__datamocks__/mockTask';

const UserAvatar = HookedUserAvatar();

const displayName = 'dashboard.Inbox.InboxItem';

type Props = {|
  item: InboxElement,
  markAsRead: (id: number) => void,
|};

const makeInboxDetail = (value: any, formatFn?: (value: any) => any) =>
  value ? (
    <span className={styles.inboxDetail}>
      {formatFn ? formatFn(value) : value}
    </span>
  ) : null;

const getType = (event: string): EventType => {
  const type = event.split(/[A-Z]/)[0];
  return type === 'action' || type === 'notification' ? type : 'notification';
};

const UnreadIndicator = ({ type }: { type: EventType }) => (
  <div
    className={`${styles.inboxUnread} ${
      type === 'action'
        ? styles.inboxUnreadAction
        : styles.inboxUnreadNotification
    }`}
  />
);

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
  item: {
    amount,
    colonyName,
    comment,
    createdAt,
    domainName,
    dueDate,
    event,
    id,
    otherUser,
    taskName,
    unread,
    user,
    onClickRoute,
  },
  markAsRead,
}: Props) => (
  <TableRow
    className={styles.inboxRow}
    onClick={() => {
      if (unread) {
        markAsRead(id);
      }
    }}
  >
    <TableCell className={styles.inboxRowCell}>
      <ConditionalWrapper to={onClickRoute} event={event} user={user}>
        {unread && <UnreadIndicator type={getType(event)} />}
        {user && (
          <UserAvatar
            className={styles.userAvatar}
            size="xxs"
            address={user.walletAddress}
          />
        )}

        <span className={styles.inboxAction}>
          <FormattedMessage
            {...MSG[event]}
            values={{
              amount: makeInboxDetail(amount, ({ unit, value }) => (
                <Numeral prefix={unit} value={value} />
              )),
              colony: makeInboxDetail(colonyName),
              comment: makeInboxDetail(comment),
              domain: makeInboxDetail(domainName),
              other: makeInboxDetail(otherUser),
              task: makeInboxDetail(taskName),
              time: makeInboxDetail(dueDate, value => (
                <TimeRelative value={value} />
              )),
              user: makeInboxDetail(user, value => value.username),
            }}
          />
        </span>

        <span className={styles.additionalDetails}>
          {colonyName && domainName ? (
            <FormattedMessage
              {...MSG.metaColonyAndDomain}
              values={{
                colony: colonyName,
                domain: domainName,
              }}
            />
          ) : (
            <FormattedMessage
              {...MSG.metaColonyOnly}
              values={{
                colony: colonyName,
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

          <span className={styles.pipe}>|</span>
          <span className={styles.time}>
            <TimeRelative value={createdAt} />
          </span>
        </span>
      </ConditionalWrapper>
    </TableCell>
  </TableRow>
);

InboxItem.displayName = displayName;

export default InboxItem;
