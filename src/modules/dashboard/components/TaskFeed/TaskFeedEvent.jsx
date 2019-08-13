/* @flow */

// $FlowFixMe
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import formatDate from 'sugar-date/date/format';

import type { Address } from '~types';
import type { TokenType, TaskFeedItemType } from '~immutable';

import TimeRelative from '~core/TimeRelative';
import Numeral from '~core/Numeral';
import taskSkillsTree from '../TaskSkills/taskSkillsTree';

import { TASK_EVENT_TYPES } from '~data/constants';
import { useDataFetcher, useSelector } from '~utils/hooks';
import { domainSelector } from '../../selectors';

import { friendlyUsernameSelector } from '../../../users/selectors';
import { tokenFetcher } from '../../fetchers';

import styles from '~dashboard/TaskFeed/TaskFeedEvent.css';

const {
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  PAYOUT_REMOVED,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
} = TASK_EVENT_TYPES;

const componentDisplayName = 'dashboard.TaskFeedEvent';

const MSG = defineMessages({
  domainSet: {
    id: 'dashboard.TaskFeedEvent.domainSet',
    defaultMessage: 'Task domain set to {domainName} by {user}',
  },
  dueDateSet: {
    id: 'dashboard.TaskFeedEvent.dueDateSet',
    defaultMessage: `Task due date {dueDateSet, select,
      true {set to {dueDate}}
      false {unset}
    } by {user}`,
  },
  payoutSet: {
    id: 'dashboard.TaskFeedEvent.payoutSet',
    defaultMessage: 'Task payout was set to {payout} by {user}',
  },
  payoutRemoved: {
    id: 'dashboard.TaskFeedEvent.payoutRemoved',
    defaultMessage: 'Task payout was removed by {user}',
  },
  skillSet: {
    id: 'dashboard.TaskFeedEvent.skillSet',
    defaultMessage: `Task skill {skillSet, select,
      true {set to {skillName}}
      false {unset}
    } by {user}`,
  },
  cancelled: {
    id: 'dashboard.TaskFeedEvent.cancelled',
    defaultMessage: 'Task cancelled by {user}',
  },
  closed: {
    id: 'dashboard.TaskFeedEvent.closed',
    defaultMessage: 'Task closed by {user}',
  },
  created: {
    id: 'dashboard.TaskFeedEvent.created',
    defaultMessage: 'Task created by {user}',
  },
  descriptionSet: {
    id: 'dashboard.TaskFeedEvent.descriptionSet',
    defaultMessage: 'Task description set to {description} by {user}',
  },
  finalized: {
    id: 'dashboard.TaskFeedEvent.finalized',
    defaultMessage: 'Task finalized by {user}',
  },
  rootDomain: {
    id: 'dashboard.TaskFeedEvent.rootDomain',
    defaultMessage: 'root',
  },
  titleSet: {
    id: 'dashboard.TaskFeedEvent.titleSet',
    defaultMessage: 'Task title set to {title} by {user}',
  },
  workInviteSent: {
    id: 'dashboard.TaskFeedEvent.workInviteSent',
    defaultMessage: '{user} invited {invitedUser} to work on the task',
  },
  workRequestCreated: {
    id: 'dashboard.TaskFeedEvent.workRequestCreated',
    defaultMessage: '{user} requested to work on the task',
  },
  workerAssigned: {
    id: 'dashboard.TaskFeedEvent.workerAssigned',
    defaultMessage: '{worker} was assigned to the task by {user}',
  },
  workerUnassigned: {
    id: 'dashboard.TaskFeedEvent.workerUnassigned',
    defaultMessage: '{worker} was unassigned from the task by {user}',
  },
});

type Props = {|
  colonyAddress: Address,
  createdAt: Date,
  event: $NonMaybeType<$PropertyType<TaskFeedItemType, 'event'>>,
|};

const TaskFeedEventDomainSet = ({
  colonyAddress,
  event: {
    meta: { userAddress },
    payload: { domainId },
  },
  intl: { formatMessage },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  const domain = useSelector(domainSelector, [colonyAddress, domainId]) || {};
  const domainName =
    domainId === 1 ? formatMessage(MSG.rootDomain) : domain.name;
  return (
    <FormattedMessage
      {...MSG.domainSet}
      values={{
        domainName: (
          <span title={domainName} className={styles.highlight}>
            {domainName}
          </span>
        ),
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventCreated = ({
  event: {
    meta: { userAddress },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.created}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventDueDateSet = ({
  event: {
    meta: { userAddress },
    payload: { dueDate },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.dueDateSet}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
        dueDate: dueDate && (
          <span
            title={formatDate(new Date(dueDate), '{short}')}
            className={styles.highlight}
          >
            {formatDate(new Date(dueDate), '{short}')}
          </span>
        ),
        dueDateSet: !!dueDate,
      }}
    />
  );
};

const TaskFeedEventPayoutSet = ({
  event: {
    meta: { userAddress },
    payload: { amount, token: tokenAddress },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  const { data: token } = useDataFetcher<TokenType>(
    tokenFetcher,
    [tokenAddress],
    [tokenAddress],
  );
  const { decimals = 18, symbol = '' } = token || {};
  return (
    <FormattedMessage
      {...MSG.payoutSet}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
        payout: (
          <span className={styles.highlightNumeral}>
            <Numeral
              integerSeparator=""
              unit={decimals}
              value={amount}
              suffix={` ${symbol}`}
            />
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventPayoutRemoved = ({
  event: {
    meta: { userAddress },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.payoutRemoved}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventSkillSet = ({
  event: {
    meta: { userAddress },
    payload: { skillId },
  },
}: *) => {
  const skill = useMemo(() => taskSkillsTree.find(({ id }) => id === skillId), [
    skillId,
  ]);
  const { name: skillName } = skill || {};
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.skillSet}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
        skillName: (
          <span title={skillName} className={styles.highlight}>
            {skillName}
          </span>
        ),
        skillSet: !!skillName,
      }}
    />
  );
};

const TaskFeedEventCancelled = ({
  event: {
    meta: { userAddress },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.cancelled}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventClosed = ({
  event: {
    meta: { userAddress },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.closed}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventDescriptionSet = ({
  event: {
    meta: { userAddress },
    payload: { description },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.descriptionSet}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
        description: (
          <span title={description} className={styles.highlight}>
            {description}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventFinalized = ({
  event: {
    meta: { userAddress },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.finalized}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventTitleSet = ({
  event: {
    meta: { userAddress },
    payload: { title },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.titleSet}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
        title: (
          <span title={title} className={styles.highlight}>
            {title}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventWorkInviteSent = ({
  event: {
    meta: { userAddress },
    payload: { workerAddress },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  const invitedUser = useSelector(friendlyUsernameSelector, [workerAddress]);
  return (
    <FormattedMessage
      {...MSG.workInviteSent}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
        invitedUser: (
          <span title={invitedUser} className={styles.highlight}>
            {invitedUser}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventWorkRequestCreated = ({
  event: {
    meta: { userAddress },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.workRequestCreated}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventWorkerAssigned = ({
  event: {
    meta: { userAddress },
    payload: { workerAddress },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  const worker = useSelector(friendlyUsernameSelector, [workerAddress]);
  return (
    <FormattedMessage
      {...MSG.workerAssigned}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
        worker: (
          <span title={worker} className={styles.highlight}>
            {worker}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventWorkerUnassigned = ({
  event: {
    payload: { userAddress, workerAddress },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  const worker = useSelector(friendlyUsernameSelector, [workerAddress]);
  return (
    <FormattedMessage
      {...MSG.workerUnassigned}
      values={{
        user: (
          <span title={user} className={styles.highlight}>
            {user}
          </span>
        ),
        worker: (
          <span title={worker} className={styles.highlight}>
            {worker}
          </span>
        ),
      }}
    />
  );
};

const FEED_EVENT_COMPONENTS = {
  [DOMAIN_SET]: injectIntl(TaskFeedEventDomainSet),
  [DUE_DATE_SET]: TaskFeedEventDueDateSet,
  [PAYOUT_SET]: TaskFeedEventPayoutSet,
  [PAYOUT_REMOVED]: TaskFeedEventPayoutRemoved,
  [SKILL_SET]: TaskFeedEventSkillSet,
  [TASK_CANCELLED]: TaskFeedEventCancelled,
  [TASK_CLOSED]: TaskFeedEventClosed,
  [TASK_CREATED]: TaskFeedEventCreated,
  [TASK_DESCRIPTION_SET]: TaskFeedEventDescriptionSet,
  [TASK_FINALIZED]: TaskFeedEventFinalized,
  [TASK_TITLE_SET]: TaskFeedEventTitleSet,
  [WORK_INVITE_SENT]: TaskFeedEventWorkInviteSent,
  [WORK_REQUEST_CREATED]: TaskFeedEventWorkRequestCreated,
  [WORKER_ASSIGNED]: TaskFeedEventWorkerAssigned,
  [WORKER_UNASSIGNED]: TaskFeedEventWorkerUnassigned,
};

const TaskFeedEvent = ({ colonyAddress, createdAt, event }: Props) => {
  const FeedEventComponent = FEED_EVENT_COMPONENTS[event.type];
  return (
    <div className={styles.main}>
      <div className={styles.event}>
        <FeedEventComponent event={event} colonyAddress={colonyAddress} />
        &nbsp;
        <TimeRelative value={createdAt} />
      </div>
    </div>
  );
};

TaskFeedEvent.displayName = componentDisplayName;

export default TaskFeedEvent;
