import React, { ReactNode, useCallback, useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { EventType } from '../types';
import { DomainType } from '~immutable/index';
import TimeRelative from '~core/TimeRelative';
import { TableRow, TableCell } from '~core/Table';
import Numeral from '~core/Numeral';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { SpinnerLoader } from '~core/Preloaders';
import { useDataFetcher } from '~utils/hooks';
import {
  Notification,
  useColonyNameLazyQuery,
  useMarkNotificationAsReadMutation,
  useTokenLazyQuery,
  useUserQuery,
  useUserLazyQuery,
  useTaskLazyQuery,
} from '~data/index';

import { domainsFetcher } from '../../../../dashboard/fetchers';

import { getFriendlyName, getUsername } from '../../../transformers';
import { transformNotificationEventNames } from '../../../data/utils';

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
  item: Notification;
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

const InboxItem = ({
  item: {
    id,
    read,
    event: {
      context,
      createdAt,
      type: eventType,
      /* onClickRoute, */
      initiatorAddress,
    },
  },
  full,
}: Props) => {
  // FIXME Get these from somewhere if applicable
  const onClickRoute = 'xxx';
  const setTo = true;
  // Let's see what event type context props we have

  // We might have more than just the worker as the target in the future
  const { workerAddress: targetUserAddress = undefined } =
    'workerAddress' in context ? context : {};
  const { taskId = undefined } = 'taskId' in context ? context : {};
  const { colonyAddress = undefined } =
    'colonyAddress' in context ? context : {};
  const { domainId = 0 } = 'domainId' in context ? context : {};
  const { tokenAddress = undefined } = 'tokenAddress' in context ? context : {};
  const { amount = undefined } = 'amount' in context ? context : {};
  const { message = undefined } = 'message' in context ? context : {};

  const { data: initiatorUser } = useUserQuery({
    variables: { address: initiatorAddress },
  });

  const [loadTargetUser, { data: targetUser }] = useUserLazyQuery();
  useEffect(() => {
    if (targetUserAddress) {
      loadTargetUser({ variables: { address: targetUserAddress } });
    }
  });

  const [loadTask, { data: taskData }] = useTaskLazyQuery();
  useEffect(() => {
    if (taskId) loadTask({ variables: { id: taskId } });
  });

  const [loadColony, { data: colonyNameData }] = useColonyNameLazyQuery();
  useEffect(() => {
    if (colonyAddress) loadColony({ variables: { address: colonyAddress } });
  });

  const [loadToken, { data: tokenData }] = useTokenLazyQuery();
  useEffect(() => {
    if (tokenAddress) loadToken({ variables: { address: tokenAddress } });
  });

  const initiatorFriendlyName = !initiatorUser
    ? initiatorAddress
    : getFriendlyName(initiatorUser.user);
  const initiatorUsername = !initiatorUser
    ? initiatorAddress
    : getUsername(initiatorUser.user);

  const targetUserFriendlyName = !targetUser
    ? targetUserAddress
    : getFriendlyName(targetUser.user);
  const targetUserUsername = !targetUser
    ? targetUserAddress
    : getUsername(targetUser.user);

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const currentDomain: DomainType | undefined = domains && domains[domainId];

  const [markAsReadMutation] = useMarkNotificationAsReadMutation({
    variables: { input: { id } },
  });

  const markAsRead = useCallback(() => markAsReadMutation(), [
    markAsReadMutation,
  ]);

  const colonyName = colonyNameData && colonyNameData.colonyName;
  const token = tokenData && tokenData.token;
  const taskTitle = taskData && taskData.task && taskData.task.title;

  return (
    <TableRow onClick={markAsRead}>
      <TableCell
        className={full ? styles.inboxRowCellFull : styles.inboxRowCellPopover}
      >
        {/*
         * @FIXME The first ever notification for every user (user profile claimed)
         * does not have a colony name or a token, so in that case the spinner
         * will always render even though it shouldn't at that point
         */
        // !colonyName ||
        // !token ||
        isFetchingDomains ? (
          <div className={styles.spinnerWrapper}>
            <SpinnerLoader
              loadingText={LOCAL_MSG.loadingText}
              appearance={{ theme: 'primary', size: 'medium' }}
            />
          </div>
        ) : (
          <WithLink to={onClickRoute}>
            {!read && <UnreadIndicator type={getType(eventType)} />}
            {initiatorUser && initiatorUser.user && (
              <div className={styles.avatarWrapper}>
                <UserAvatar
                  showInfo
                  size="xxs"
                  address={initiatorUser.user.profile.walletAddress}
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
                      suffix={` ${token ? token.details.symbol : ''}`}
                      integerSeparator=""
                      unit={(token && token.details.decimals) || 18}
                      value={value}
                    />
                  )),
                  colonyAddress: makeInboxDetail(colonyAddress),
                  colonyName: makeInboxDetail(colonyName),
                  colonyDisplayName: makeInboxDetail(colonyName, value =>
                    colonyName ? (
                      <Link to={`/colony/${colonyName}`}>{value}</Link>
                    ) : (
                      value
                    ),
                  ),
                  comment: makeInboxDetail(message),
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
                    colonyName && taskId ? (
                      <Link to={`/colony/${colonyName}/task/${taskId}`}>
                        {value}
                      </Link>
                    ) : (
                      value
                    ),
                  ),
                  time: makeInboxDetail(createdAt, value => (
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
                          <Link to={`/colony/${colonyName}`}>{colonyName}</Link>
                        ),
                        domainName: currentDomain && currentDomain.name,
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      {...MSG.metaColonyOnly}
                      values={{
                        colonyDisplayName: (
                          <Link to={`/colony/${colonyName}`}>{colonyName}</Link>
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
                    suffix={` ${token ? token.details.symbol : ''}`}
                    integerSeparator=""
                    unit={(token && token.details.decimals) || 18}
                    value={amount}
                    appearance={{ size: 'small', theme: 'grey' }}
                  />
                </span>
              )}

              {(colonyName || amount) && <span className={styles.pipe}>|</span>}
              <span className={styles.time}>
                {createdAt && <TimeRelative value={new Date(createdAt)} />}
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
