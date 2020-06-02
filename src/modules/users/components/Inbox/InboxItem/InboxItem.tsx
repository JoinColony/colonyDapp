import React, { ReactNode, useCallback, useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { EventType } from '../types';
import TimeRelative from '~core/TimeRelative';
import { TableRow, TableCell } from '~core/Table';
import Numeral from '~core/Numeral';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { SpinnerLoader } from '~core/Preloaders';
import {
  useColonyNameQuery,
  useDomainQuery,
  useLoggedInUser,
  useMarkNotificationAsReadMutation,
  useTokenQuery,
  useUserQuery,
  useTaskQuery,
  useProgramQuery,
  OneNotification,
  UserNotificationsDocument,
} from '~data/index';

import { useLevelAfter } from '../../../../dashboard/hooks/useLevelAfter';

import { getFriendlyName, getUsername } from '../../../transformers';
import { transformNotificationEventNames } from '../events';

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
  item: OneNotification;
  full?: boolean;
}

const INBOX_REGEX = /[A-Z]/;

const getType = (eventType: string): EventType => {
  const notificationId = transformNotificationEventNames(eventType) || '';
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
      /*
       * @TODO Disabled notification click for initial deployment
       *
       * onClickRoute,
       */
      initiatorAddress,
    },
  },
  full,
}: Props) => {
  const { walletAddress } = useLoggedInUser();
  const setTo = true;
  // Let's see what event type context props we have

  // We might have more than just the worker as the target in the future
  const { workerAddress: targetUserAddress = '' } =
    'workerAddress' in context ? context : {};
  const { payouts = undefined } = 'payouts' in context ? context : {};
  // only support one payout for now
  const payout = payouts && payouts[0];
  const { taskId = '' } = 'taskId' in context ? context : {};
  const { colonyAddress = undefined } =
    'colonyAddress' in context ? context : {};
  const { ethDomainId = 0 } = 'ethDomainId' in context ? context : {};
  const { tokenAddress = '' } = 'tokenAddress' in context ? context : {};
  const { amount = undefined } = 'amount' in context ? context : {};
  const { message = undefined } = 'message' in context ? context : {};
  const { programId = undefined } = 'programId' in context ? context : {};
  const { levelId = undefined } = 'levelId' in context ? context : {};
  const { persistentTaskId = undefined } =
    'persistentTaskId' in context ? context : {};
  /*
   * @NOTE On Perfomance
   * Trying to fetch query data directly, even if it fails (empty variable passed along) has better
   * performance than trying to load it conditionally via `useEffect()` (useQuery v. useLazyQuery)
   */
  const { data: initiatorUser } = useUserQuery({
    variables: { address: initiatorAddress },
  });

  const { data: targetUser } = useUserQuery({
    variables: { address: targetUserAddress },
  });

  const { data: taskData } = useTaskQuery({ variables: { id: taskId } });

  const { data: colonyNameData } = useColonyNameQuery({
    variables: { address: colonyAddress || '' },
  });

  const { data: tokenData } = useTokenQuery({
    variables: { address: tokenAddress },
  });

  const { data: programData } = useProgramQuery({
    variables: { id: programId || '' },
  });

  const { data: domainData } = useDomainQuery({
    variables: { colonyAddress: colonyAddress || '', ethDomainId },
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

  const [markAsReadMutation] = useMarkNotificationAsReadMutation({
    variables: { input: { id } },
    refetchQueries: [
      {
        query: UserNotificationsDocument,
        variables: { address: walletAddress },
      },
    ],
  });

  const markAsRead = useCallback(() => markAsReadMutation(), [
    markAsReadMutation,
  ]);

  const colonyName = colonyNameData && colonyNameData.colonyName;
  const token = tokenData && tokenData.token;
  const taskTitle = taskData && taskData.task && taskData.task.title;
  const program = programData && programData.program;
  const programTitle = program && program.title;
  const level = useMemo(
    () =>
      program && program.levels.find((levelItem) => levelItem.id === levelId),
    [levelId, program],
  );
  const levelTitle = level && level.title;
  const nextLevel = useLevelAfter(program, levelId);
  const nextLevelTitle = nextLevel && nextLevel.title;
  const persistentTask = useMemo(
    () => level && level.steps.find((step) => step.id === persistentTaskId),
    [level, persistentTaskId],
  );
  const persistentTaskTitle = persistentTask && persistentTask.title;
  const domainName = domainData && domainData.domain.name;

  return (
    <TableRow onClick={markAsRead}>
      <TableCell
        className={full ? styles.inboxRowCellFull : styles.inboxRowCellPopover}
      >
        {(colonyAddress && !colonyName) || (tokenAddress && !token) ? (
          <div className={styles.spinnerWrapper}>
            <SpinnerLoader
              loadingText={LOCAL_MSG.loadingText}
              appearance={{ theme: 'primary', size: 'medium' }}
            />
          </div>
        ) : (
          <WithLink>
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
                {...MSG[transformNotificationEventNames(eventType)]}
                values={{
                  amount: makeInboxDetail(amount, (value) => (
                    <Numeral
                      suffix={` ${token ? token.symbol : ''}`}
                      integerSeparator=""
                      value={value}
                    />
                  )),
                  colonyAddress: makeInboxDetail(colonyAddress),
                  colonyName: makeInboxDetail(colonyName),
                  colonyDisplayName: makeInboxDetail(colonyName, (value) =>
                    colonyName ? (
                      <Link to={`/colony/${colonyName}`}>{value}</Link>
                    ) : (
                      value
                    ),
                  ),
                  comment: makeInboxDetail(message),
                  domainName: makeInboxDetail(domainName),
                  level: makeInboxDetail(levelTitle),
                  nextLevel: makeInboxDetail(nextLevelTitle),
                  otherUser: makeInboxDetail(targetUserFriendlyName, (value) =>
                    targetUserUsername ? (
                      <Link to={`/user/${targetUserUsername}`}>{value}</Link>
                    ) : (
                      value
                    ),
                  ),
                  submissionPayout: makeInboxDetail(payout, (value) => (
                    <Numeral
                      suffix={` ${payout ? payout.token.symbol : ''}`}
                      integerSeparator=""
                      value={value.amount}
                    />
                  )),
                  persistentTask: makeInboxDetail(persistentTaskTitle),
                  program: makeInboxDetail(programTitle),
                  task: makeInboxDetail(taskTitle, (value) =>
                    colonyName && taskId ? (
                      <Link to={`/colony/${colonyName}/task/${taskId}`}>
                        {value}
                      </Link>
                    ) : (
                      value
                    ),
                  ),
                  type: eventType,
                  time: makeInboxDetail(createdAt, (value) => (
                    <TimeRelative value={value} />
                  )),
                  user: makeInboxDetail(initiatorFriendlyName, (value) =>
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
                  {domainName ? (
                    <FormattedMessage
                      {...MSG.metaColonyAndDomain}
                      values={{
                        colonyDisplayName: (
                          <Link to={`/colony/${colonyName}`}>{colonyName}</Link>
                        ),
                        domainName,
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
                  {colonyName && <span className={styles.pipe}>|</span>}
                  <Numeral
                    suffix={` ${token ? token.symbol : ''}`}
                    integerSeparator=""
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
