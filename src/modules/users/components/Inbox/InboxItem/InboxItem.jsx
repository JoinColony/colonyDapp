/* @flow */

import type { Node } from 'react';

import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import type { InboxElement } from '../types';
import type { UserType, ColonyType, DomainType } from '~immutable';

import TimeRelative from '~core/TimeRelative';
import { TableRow, TableCell } from '~core/Table';
import Numeral from '~core/Numeral';
import Button from '~core/Button';
import { DialogLink } from '~core/Dialog';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { SpinnerLoader } from '~core/Preloaders';

import { useDataFetcher, useSelector } from '~utils/hooks';

import { userFetcher } from '../../../fetchers';
import { colonyFetcher, domainsFetcher } from '../../../../dashboard/fetchers';
import { friendlyColonyNameSelector } from '../../../../dashboard/selectors';
import { friendlyUsernameSelector } from '../../../selectors';

import styles from './InboxItem.css';

import { mockTask } from '../../../../dashboard/components/Task/__datamocks__/mockTask';

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
  // Handle read/unread notifications (inbox items)
  // markAsRead: (id: string) => void,
|};

const makeInboxDetail = (value: any, formatFn?: (value: any) => any) =>
  value ? (
    <span className={styles.inboxDetail}>
      {formatFn ? formatFn(value) : value}
    </span>
  ) : null;

// Handle read/unread notifications
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
  /**
   * @todo Handle inbox event types dynamically.
   * @body Make this happen dynamically, we can't create a condition for each inbox event
   */
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
    // Handle read/unread notifications
    // unread,
    otherUserAddress,
    amount,
    colonyName,
    colonyAddress,
    comment,
    timestamp,
    domainName,
    domainId,
    event,
    taskTitle,
    userAddress,
    onClickRoute,
  },
}: Props) => {
  const { data: user, isFetching: isFetchingUser } = useDataFetcher<UserType>(
    userFetcher,
    [userAddress],
    [userAddress],
  );
  const userDisplayWithFallback = useSelector(friendlyUsernameSelector, [
    userAddress,
  ]);
  const otherUserDisplayWithFallback = useSelector(friendlyUsernameSelector, [
    otherUserAddress,
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
  const currentDomain =
    (domainName && { name: domainName }) ||
    (domains && domains.find(({ id }) => id === domainId || 0));
  return (
    <TableRow
      className={styles.inboxRow}
      // Handle read/unread notifications
      // onClick={() => unread && markAsRead(id)}
    >
      <TableCell className={styles.inboxRowCell}>
        {isFetchingUser || isFetchingColony || isFetchingDomains ? (
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
            {/*
             * Handle read/unread notifications
             */}
            {/* {unread && <UnreadIndicator type={getType(event)} />} */}
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
                 * depending if the otherUser address is the same as the userAddress
                 * This is preffered as opposed to adding two notifications to the stores
                 */
                {...MSG[event]}
                values={{
                  amount: makeInboxDetail(amount, value => (
                    <Numeral
                      /*
                       * @todo Re-enable prifx value, when token registering has been fixed
                       */
                      // prefix={unit}
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
                  otherUser: makeInboxDetail(otherUserDisplayWithFallback),
                  task: makeInboxDetail(taskTitle),
                  time: makeInboxDetail(timestamp, value => (
                    <TimeRelative value={value} />
                  )),
                  user: makeInboxDetail(userDisplayWithFallback),
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

              {amount && (
                <span>
                  <span className={styles.pipe}>|</span>
                  <span className={styles.amount}>
                    <Numeral
                      /*
                       * @todo Re-enable prifx value, when token registering has been fixed
                       */
                      // prefix={unit}
                      value={amount.toString()}
                      appearance={{ size: 'small', theme: 'grey' }}
                    />
                  </span>
                </span>
              )}

              {((colony && colony.colonyName) || amount) && (
                <span className={styles.pipe}>|</span>
              )}
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
