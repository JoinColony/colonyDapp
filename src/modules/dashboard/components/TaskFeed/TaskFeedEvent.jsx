/* @flow */

// $FlowFixMe
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import formatDate from 'sugar-date/date/format';

import type { TaskFeedItemType } from '~immutable';

import { TASK_EVENT_TYPES } from '~data/constants';
import { useSelector } from '~utils/hooks';
import { domainSelector } from '../../selectors';
import { friendlyUsernameSelector } from '../../../users/selectors';
import taskSkillsTree from '../TaskSkills/taskSkillsTree';

import TimeRelative from '~core/TimeRelative';

import styles from '~dashboard/TaskFeed/TaskFeedEvent.css';

const {
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
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
    defaultMessage: 'Task due date set to {dueDate} by {user}',
  },
  payoutSet: {
    id: 'dashboard.TaskFeedEvent.payoutSet',
    defaultMessage: 'Task payout added by {user}', // Add other text in #943
  },
  skillSet: {
    id: 'dashboard.TaskFeedEvent.skillSet',
    defaultMessage: 'Task skill set to {skillName} by {user}',
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
  createdAt: Date,
  event: $NonMaybeType<$PropertyType<TaskFeedItemType, 'event'>>,
|};

const TaskFeedEventDomainSet = ({
  event: {
    meta: { userAddress },
    payload: { domainId },
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  const { domainName } = useSelector(domainSelector, [domainId]) || {
    domainName: 'Example domain',
  };
  return (
    <FormattedMessage
      {...MSG.domainSet}
      values={{
        domainName,
        user: <span>{user}</span>,
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
    <FormattedMessage {...MSG.created} values={{ user: <span>{user}</span> }} />
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
        user: <span>{user}</span>,
        dueDate: formatDate(new Date(dueDate), '{short}'),
      }}
    />
  );
};

const TaskFeedEventPayoutSet = ({
  event: {
    meta: { userAddress },
    // Use more from the action payload in #943
  },
}: *) => {
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.payoutSet}
      values={{ user: <span>{user}</span> }}
    />
  );
};

const TaskFeedEventSkillSet = ({
  event: {
    meta: { userAddress },
    payload: { skillId },
  },
}: *) => {
  const { name: skillName } = useMemo(
    () => taskSkillsTree.find(({ id }) => id === skillId),
    [skillId],
  );
  const user = useSelector(friendlyUsernameSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.skillSet}
      values={{ user: <span>{user}</span>, skillName }}
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
      values={{ user: <span>{user}</span> }}
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
    <FormattedMessage {...MSG.closed} values={{ user: <span>{user}</span> }} />
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
      values={{ user: <span>{user}</span>, description }}
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
      values={{ user: <span>{user}</span> }}
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
      values={{ user: <span>{user}</span>, title }}
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
        user: <span>{user}</span>,
        invitedUser: <span>{invitedUser}</span>,
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
  return <FormattedMessage {...MSG.workRequestCreated} values={{ user }} />;
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
      values={{ user: <span>{user}</span>, worker: <span>{worker}</span> }}
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
      values={{ user: <span>{user}</span>, worker: <span>{worker}</span> }}
    />
  );
};

const FEED_EVENT_COMPONENTS = {
  [DOMAIN_SET]: TaskFeedEventDomainSet,
  [DUE_DATE_SET]: TaskFeedEventDueDateSet,
  [PAYOUT_SET]: TaskFeedEventPayoutSet,
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

const TaskFeedEvent = ({ createdAt, event }: Props) => {
  const FeedEventComponent = FEED_EVENT_COMPONENTS[event.type];
  return (
    <div className={styles.main}>
      <FeedEventComponent event={event} />
      &nbsp;
      <TimeRelative value={createdAt} />
    </div>
  );
};

TaskFeedEvent.displayName = componentDisplayName;

export default TaskFeedEvent;
