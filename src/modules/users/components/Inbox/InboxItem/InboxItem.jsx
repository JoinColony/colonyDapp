/* @flow */

import type { Node } from 'react';

// $FlowFixMe until hooks flow types
import React, { useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import type { EventType } from '../types';
import type {
  UserType,
  ColonyType,
  DomainType,
  TokenType,
  InboxItemType,
} from '~immutable';

import TimeRelative from '~core/TimeRelative';
import { TableRow, TableCell } from '~core/Table';
import Numeral from '~core/Numeral';
import Button from '~core/Button';
import { DialogLink } from '~core/Dialog';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { SpinnerLoader } from '~core/Preloaders';

import { useDataFetcher, useSelector, useAsyncFunction } from '~utils/hooks';

import { userFetcher } from '../../../fetchers';
import {
  colonyFetcher,
  domainsFetcher,
  tokenFetcher,
} from '../../../../dashboard/fetchers';
import { friendlyColonyNameSelector } from '../../../../dashboard/selectors';
import { friendlyUsernameSelector } from '../../../selectors';

import { ACTIONS } from '~redux';
import { mergePayload } from '~utils/actions';

import styles from './InboxItem.css';

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
  activity: InboxItemType,
|};

const INBOX_REGEX = /[A-Z]/;

const getType = (event: string): EventType => {
  const type = event.split(INBOX_REGEX)[0];
  return type === 'action' || type === 'notification' ? type : 'notification';
};

const makeInboxDetail = (value: any, formatFn?: (value: any) => any) =>
  value ? (
    <span className={styles.inboxDetail}>
      {formatFn ? formatFn(value) : value}
    </span>
  ) : null;

const UnreadIndicator = ({ type }: { type: EventType }) => (
  <div
    className={`${styles.inboxUnread} ${
      type === 'action'
        ? styles.inboxUnreadAction
        : styles.inboxUnreadNotification
    }`}
  />
);

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
  /**
   * @todo Handle inbox event types dynamically.
   * @body Make this happen dynamically, we can't create a condition for each inbox event
   */
  if (event === 'actionWorkerInviteReceived') {
    const { colonyAddress, draftId } = event;
    return (
      <DialogLink
        to="TaskInviteDialog"
        props={{
          assignee: { profile: user },
          colonyAddress,
          draftId,
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
    unread = true,
    id,
    amount,
    tokenAddress,
    colonyName,
    colonyAddress,
    comment,
    domainName,
    domainId,
    event,
    onClickRoute,
    sourceUserAddress,
    taskTitle,
    targetUserAddress,
    timestamp,
  },
}: Props) => {
  const { data: user, isFetching: isFetchingUser } = useDataFetcher<UserType>(
    userFetcher,
    [sourceUserAddress],
    [sourceUserAddress],
  );
  const sourceUserDisplayWithFallback = useSelector(friendlyUsernameSelector, [
    sourceUserAddress,
  ]);
  const targetUserDisplayWithFallback = useSelector(friendlyUsernameSelector, [
    targetUserAddress,
  ]);
  const {
    data: colony,
    isFetching: isFetchingColony,
  } = useDataFetcher<ColonyType>(
    colonyFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const colonyDisplayNameWithFallback = useSelector(
    friendlyColonyNameSelector,
    [colonyAddress],
  );
  const colonyNameWithFallback = (colony && colony.colonyName) || colonyName;
  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher<
    DomainType[],
  >(domainsFetcher, [colonyAddress], [colonyAddress]);
  const {
    data: token,
    isFetching: isFetchingToken,
  } = useDataFetcher<TokenType>(tokenFetcher, [tokenAddress], [tokenAddress]);
  const currentDomain =
    (domainName && { name: domainName }) ||
    (domains &&
      domains.find(
        ({ id: currentDomainId }) => currentDomainId === domainId || 0,
      ));

  const readActions = {
    submit: ACTIONS.INBOX_MARK_NOTIFICATION_READ,
    success: ACTIONS.INBOX_MARK_NOTIFICATION_READ_SUCCESS,
    error: ACTIONS.INBOX_MARK_NOTIFICATION_READ_ERROR,
  };

  const transform = useCallback(mergePayload({ id, timestamp }), [
    id,
    timestamp,
  ]);
  const markAsRead = useAsyncFunction({ ...readActions, transform });
  return (
    <TableRow className={styles.inboxRow} onClick={() => markAsRead(id)}>
      <TableCell className={styles.inboxRowCell}>
        {isFetchingUser ||
        isFetchingColony ||
        isFetchingDomains ||
        isFetchingToken ? (
          <div className={styles.spinnerWrapper}>
            <SpinnerLoader
              loadingText={LOCAL_MSG.loadingText}
              appearance={{ theme: 'primary', size: 'medium' }}
            />
          </div>
        ) : (
          <ConditionalWrapper
            to={onClickRoute}
            event={event}
            user={(user && user.profile) || {}}
          >
            {unread && <UnreadIndicator type={getType(event)} />}
            {user && (
              <UserAvatar
                size="xxs"
                address={user.profile.walletAddress}
                className={styles.userAvatar}
              />
            )}
            <span className={styles.inboxAction}>
              <FormattedMessage
                /*
                 * @todo switch between notificationAdminOtherAdded v. notificationUserMadeAdmin notifications
                 * depending if the otherUser address is the same as the sourceUserAddress
                 * This is preffered as opposed to adding two notifications to the stores
                 */
                {...MSG[event]}
                values={{
                  amount: makeInboxDetail(amount, value => (
                    <Numeral
                      suffix={` ${token ? token.symbol : ''}`}
                      integerSeparator=""
                      truncate={2}
                      unit={(token && token.decimals) || 18}
                      value={value}
                    />
                  )),
                  colonyDisplayName: makeInboxDetail(
                    colonyDisplayNameWithFallback,
                  ),
                  colonyName: makeInboxDetail(colonyNameWithFallback),
                  comment: makeInboxDetail(comment),
                  domainName: makeInboxDetail(
                    currentDomain && currentDomain.name,
                  ),
                  otherUser: makeInboxDetail(targetUserDisplayWithFallback),
                  task: makeInboxDetail(taskTitle),
                  time: makeInboxDetail(timestamp, value => (
                    <TimeRelative value={value} />
                  )),
                  user: makeInboxDetail(sourceUserDisplayWithFallback),
                }}
              />
            </span>

            <span className={styles.additionalDetails}>
              {colony && colony.colonyName && (domainName || currentDomain) && (
                <FormattedMessage
                  {...MSG.metaColonyAndDomain}
                  values={{
                    colonyName: colonyNameWithFallback,
                    domainName: currentDomain && currentDomain.name,
                  }}
                />
              )}
              {colony && colony.colonyName && !currentDomain && (
                <FormattedMessage
                  {...MSG.metaColonyOnly}
                  values={{
                    colonyName: colonyNameWithFallback,
                  }}
                />
              )}

              {amount && token && (
                <span>
                  <span className={styles.pipe}>|</span>
                  <span className={styles.amount}>
                    <Numeral
                      suffix={` ${token ? token.symbol : ''}`}
                      integerSeparator=""
                      truncate={2}
                      unit={(token && token.decimals) || 18}
                      value={amount}
                      appearance={{ size: 'small', theme: 'grey' }}
                    />
                  </span>
                </span>
              )}

              {((colony && colony.colonyName) || amount) && (
                <span className={styles.pipe}>|</span>
              )}
              <span className={styles.time}>
                {timestamp && <TimeRelative value={new Date(timestamp)} />}
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
