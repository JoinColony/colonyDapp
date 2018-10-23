/* @flow */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import TimeRelative from '~core/TimeRelative';
import { TableRow, TableCell } from '~core/Table';
import UserAvatar from '~core/UserAvatar';

import type { Node } from 'react';
import styles from './InboxItem.css';
import MSG from './messages';

import type { InboxElement, EventType } from './types';

const displayName = 'dashboard.Inbox.InboxItem';

type Props = {
  item: InboxElement,
  markAsRead: (id: number) => void,
};

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

const ConditionalLink = ({ to, children }: { to?: string, children: Node }) =>
  to ? (
    <Link to={to}>
      <div className={styles.inboxDetails}>{children}</div>
    </Link>
  ) : (
    <div className={styles.inboxDetails}>{children}</div>
  );

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
    onClick={() => unread && markAsRead(id)}
  >
    <TableCell className={styles.inboxRowCell}>
      <ConditionalLink to={onClickRoute}>
        {unread && <UnreadIndicator type={getType(event)} />}
        {user && (
          <UserAvatar
            size="xxs"
            walletAddress={user.walletAddress}
            username={user.username}
            className={styles.UserAvatar}
          />
        )}

        <FormattedMessage
          className={styles.inboxAction}
          {...MSG[event]}
          values={{
            amount: makeInboxDetail(
              amount,
              value => `${value.unit}${value.value}`,
            ),
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
      </ConditionalLink>
    </TableCell>
  </TableRow>
);

InboxItem.displayName = displayName;

export default InboxItem;
