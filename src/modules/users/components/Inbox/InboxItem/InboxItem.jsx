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
// import Button from '~core/Button';
// import { DialogLink } from '~core/Dialog';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { SpinnerLoader } from '~core/Preloaders';

import {
  useDataFetcher,
  useDataSubscriber,
  useSelector,
  useAsyncFunction,
} from '~utils/hooks';

import { userFetcher } from '../../../fetchers';
import { domainsFetcher, tokenFetcher } from '../../../../dashboard/fetchers';
import { colonySubscriber } from '../../../../dashboard/subscribers';
import { friendlyColonyNameSelector } from '../../../../dashboard/selectors';
import {
  friendlyUsernameSelector,
  currentUserSelector,
  usernameSelector,
} from '../../../selectors';
import { transformNotificationEventNames } from '../../../data/utils';

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

const getType = (eventType: string): EventType => {
  const notificationId = transformNotificationEventNames(eventType);
  const type = notificationId.split(INBOX_REGEX)[0];
  return type === 'action' || type === 'notification' ? type : 'notification';
};

// Suggestion: consider adding an optional <Link> wrapper in this component?
const makeInboxDetail = (value: any, formatFn?: (value: any) => any) =>
  value ? (
    <span title={formatFn ? '' : value} className={styles.inboxDetail}>
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

const WithLink = ({ to, children }: { to?: string, children: Node }) =>
  to ? (
    <Link to={to} className={styles.fullWidthLink}>
      <div className={styles.inboxDetails}>{children}</div>
    </Link>
  ) : (
    <div className={styles.inboxDetails}>{children}</div>
  );

const readActions = {
  submit: ACTIONS.INBOX_MARK_NOTIFICATION_READ,
  success: ACTIONS.INBOX_MARK_NOTIFICATION_READ_SUCCESS,
  error: ACTIONS.INBOX_MARK_NOTIFICATION_READ_ERROR,
};

const InboxItem = ({
  activity: {
    unread = true,
    type: eventType,
    id,
    context: {
      amount,
      colonyAddress,
      comment,
      domainId,
      draftId,
      setTo,
      targetUserAddress,
      taskTitle,
      tokenAddress,
    },
    onClickRoute,
    sourceAddress: sourceUserAddress,
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
  const sourceUsername = user && user.profile && user.profile.username;

  const currentUser = useSelector(currentUserSelector);
  const targetUserDisplayWithFallback = useSelector(friendlyUsernameSelector, [
    targetUserAddress || currentUser.profile.walletAddress,
  ]);
  const targetUsername = useSelector(usernameSelector, [
    targetUserAddress || currentUser.profile.walletAddress,
  ]);

  const {
    data: colony,
    isFetching: isFetchingColony,
  } = useDataSubscriber<ColonyType>(
    colonySubscriber,
    [colonyAddress],
    [colonyAddress],
    { alwaysSubscribe: false },
  );
  const colonyDisplayNameWithFallback = useSelector(
    friendlyColonyNameSelector,
    [colonyAddress],
  );
  const colonyName = colony && colony.colonyName;

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher<
    DomainType[],
  >(domainsFetcher, [colonyAddress], [colonyAddress]);
  const currentDomain =
    domains && domains.find(domain => domain.id === domainId || 0);

  const {
    data: token,
    isFetching: isFetchingToken,
  } = useDataFetcher<TokenType>(tokenFetcher, [tokenAddress], [tokenAddress]);

  const transform = useCallback(mergePayload({ id, timestamp }), [
    id,
    timestamp,
  ]);
  const markAsRead = useAsyncFunction({ ...readActions, transform });

  const isFetching =
    isFetchingUser || isFetchingColony || isFetchingDomains || isFetchingToken;

  return (
    <TableRow onClick={() => markAsRead(id)}>
      <TableCell className={styles.inboxRowCell}>
        {isFetching ? (
          <div className={styles.spinnerWrapper}>
            <SpinnerLoader
              loadingText={LOCAL_MSG.loadingText}
              appearance={{ theme: 'primary', size: 'medium' }}
            />
          </div>
        ) : (
          <WithLink to={onClickRoute}>
            {unread && <UnreadIndicator type={getType(eventType)} />}
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
                {...MSG[transformNotificationEventNames(eventType)]}
                values={{
                  amount: makeInboxDetail(amount, value => (
                    <Numeral
                      suffix={` ${token ? token.symbol : ''}`}
                      integerSeparator=""
                      unit={(token && token.decimals) || 18}
                      value={value}
                    />
                  )),
                  colonyAddress: makeInboxDetail(colonyAddress),
                  colonyDisplayName: makeInboxDetail(
                    colonyDisplayNameWithFallback,
                    value =>
                      colonyName ? (
                        <Link to={`colony/${colonyName}`}>{value}</Link>
                      ) : (
                        value
                      ),
                  ),
                  comment: makeInboxDetail(comment),
                  domainName: makeInboxDetail(
                    currentDomain && currentDomain.name,
                  ),
                  otherUser: makeInboxDetail(
                    targetUserDisplayWithFallback,
                    value =>
                      targetUsername ? (
                        <Link to={`user/${targetUsername}`}>{value}</Link>
                      ) : (
                        value
                      ),
                  ),
                  task: makeInboxDetail(taskTitle, value =>
                    colonyName && draftId ? (
                      <Link to={`colony/${colonyName}/task/${draftId}`}>
                        {value}
                      </Link>
                    ) : (
                      value
                    ),
                  ),
                  time: makeInboxDetail(timestamp, value => (
                    <TimeRelative value={value} />
                  )),
                  user: makeInboxDetail(sourceUserDisplayWithFallback, value =>
                    sourceUsername ? (
                      <Link to={`user/${sourceUsername}`}>{value}</Link>
                    ) : (
                      value
                    ),
                  ),
                  setTo,
                }}
              />
            </span>

            <span className={styles.additionalDetails}>
              {colonyName && (
                <span
                  title={colonyName}
                  className={styles.additionalDetailsTruncate}
                >
                  {currentDomain ? (
                    <FormattedMessage
                      {...MSG.metaColonyAndDomain}
                      values={{
                        colonyDisplayName: (
                          <Link to={`colony/${colonyName}`}>
                            {colonyDisplayNameWithFallback}
                          </Link>
                        ),
                        domainName: currentDomain && currentDomain.name,
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      {...MSG.metaColonyOnly}
                      values={{
                        colonyDisplayName: (
                          <Link to={`colony/${colonyName}`}>
                            {colonyDisplayNameWithFallback}
                          </Link>
                        ),
                      }}
                    />
                  )}
                </span>
              )}

              {amount && token && (
                <span>
                  <span className={styles.pipe}>|</span>
                  <Numeral
                    suffix={` ${token ? token.symbol : ''}`}
                    integerSeparator=""
                    unit={(token && token.decimals) || 18}
                    value={amount}
                    appearance={{ size: 'small', theme: 'grey' }}
                  />
                </span>
              )}

              {(colonyName || amount) && <span className={styles.pipe}>|</span>}
              <span className={styles.time}>
                {timestamp && <TimeRelative value={new Date(timestamp)} />}
              </span>
            </span>
          </WithLink>
        )}
      </TableCell>
    </TableRow>
  );
};

InboxItem.displayName = displayName;

export default InboxItem;
