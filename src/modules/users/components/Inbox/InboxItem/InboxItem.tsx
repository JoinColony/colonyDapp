import React, { ReactNode, useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { EventType } from '../types';
import { DomainType, InboxItemType } from '~immutable/index';
import TimeRelative from '~core/TimeRelative';
import { TableRow, TableCell } from '~core/Table';
import Numeral from '~core/Numeral';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { SpinnerLoader } from '~core/Preloaders';
import { useDataFetcher, useSelector, useAsyncFunction } from '~utils/hooks';

import {
  domainsFetcher,
  tokenFetcher,
  colonyFetcher,
} from '../../../../dashboard/fetchers';

import { friendlyColonyNameSelector } from '../../../../dashboard/selectors';
import { getFriendlyName, getUsername } from '../../../transformers';
import { transformNotificationEventNames } from '../../../data/utils';
import { ActionTypes } from '~redux/index';
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

export interface Props {
  item: InboxItemType;
  full?: boolean;
}

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

const WithLink = ({ to, children }: { to?: string; children: ReactNode }) =>
  to ? (
    <Link to={to} className={styles.fullWidthLink}>
      <div className={styles.inboxDetails}>{children}</div>
    </Link>
  ) : (
    <div className={styles.inboxDetails}>{children}</div>
  );

const readActions = {
  submit: ActionTypes.INBOX_MARK_NOTIFICATION_READ,
  success: ActionTypes.INBOX_MARK_NOTIFICATION_READ_SUCCESS,
  error: ActionTypes.INBOX_MARK_NOTIFICATION_READ_ERROR,
};

const InboxItem = ({
  item: {
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
      taskTitle,
      tokenAddress,
    },
    onClickRoute,
    initiator,
    // FIXME targetUser needs to be expanded on the db. If not given in event on db it needs to be the current user
    targetUser,
    timestamp,
  },
  full,
}: Props) => {
  const initiatorFriendlyName =
    typeof initiator == 'string' ? initiator : getFriendlyName(initiator);
  const initiatorUsername =
    typeof initiator == 'string' ? initiator : getUsername(initiator);

  const targetUserFriendlyName =
    typeof targetUser == 'string' ? targetUser : getFriendlyName(targetUser);
  const targetUserUsername =
    typeof targetUser == 'string' ? targetUser : getUsername(targetUser);

  const { data: colony, isFetching: isFetchingColony } = useDataFetcher(
    colonyFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const colonyDisplayNameWithFallback = useSelector(
    friendlyColonyNameSelector,
    [colonyAddress],
  );
  const colonyName = colony && colony.colonyName;

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const currentDomain: DomainType | undefined =
    domainId && domains && domains[domainId];

  const { data: token, isFetching: isFetchingToken } = useDataFetcher(
    tokenFetcher,
    [tokenAddress],
    [tokenAddress],
  );

  const transform = useCallback(mergePayload({ id, timestamp }), [
    id,
    timestamp,
  ]);
  const markAsRead = useAsyncFunction({ ...readActions, transform });

  const isFetching = isFetchingColony || isFetchingDomains || isFetchingToken;

  return (
    <TableRow onClick={() => markAsRead(id)}>
      <TableCell
        className={full ? styles.inboxRowCellFull : styles.inboxRowCellPopover}
      >
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
            {typeof initiator != 'string' && (
              <div className={styles.avatarWrapper}>
                <UserAvatar
                  showInfo
                  size="xxs"
                  address={initiator.profile.walletAddress}
                  className={styles.userAvatar}
                />
              </div>
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
                  colonyName: makeInboxDetail(colonyName),
                  colonyDisplayName: makeInboxDetail(
                    colonyDisplayNameWithFallback,
                    value =>
                      colonyName ? (
                        <Link to={`/colony/${colonyName}`}>{value}</Link>
                      ) : (
                        value
                      ),
                  ),
                  comment: makeInboxDetail(comment),
                  domainName: makeInboxDetail(
                    currentDomain && currentDomain.name,
                  ),
                  otherUser: makeInboxDetail(targetUserFriendlyName, value =>
                    targetUserUsername ? (
                      <Link to={`/user/${targetUserUsername}`}>{value}</Link>
                    ) : (
                      value
                    ),
                  ),
                  task: makeInboxDetail(taskTitle, value =>
                    colonyName && draftId ? (
                      <Link to={`/colony/${colonyName}/task/${draftId}`}>
                        {value}
                      </Link>
                    ) : (
                      value
                    ),
                  ),
                  time: makeInboxDetail(timestamp, value => (
                    <TimeRelative value={value} />
                  )),
                  user: makeInboxDetail(initiatorFriendlyName, value =>
                    initiatorUsername ? (
                      <Link to={`/user/${initiatorUsername}`}>{value}</Link>
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
                          <Link to={`/colony/${colonyName}`}>
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
                          <Link to={`/colony/${colonyName}`}>
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
