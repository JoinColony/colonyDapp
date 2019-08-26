import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import formatDate from 'sugar-date/date/format';
import { TaskEvents } from '~data/types/TaskEvents';

import { Address } from '~types/index';
import { TokenType } from '~immutable/index';
import TimeRelative from '~core/TimeRelative';
import Numeral from '~core/Numeral';
import InfoPopover from '~core/InfoPopover';
import taskSkillsTree from '../TaskSkills/taskSkillsTree';
import { EventTypes } from '~data/constants';
import { useDataFetcher, useSelector } from '~utils/hooks';
import { domainSelector } from '../../selectors';
import { userSelector } from '../../../users/selectors';
import { tokenFetcher } from '../../fetchers';
import styles from '~dashboard/TaskFeed/TaskFeedEvent.css';

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
  titleRemoved: {
    id: 'dashboard.TaskFeedEvent.titleRemoved',
    defaultMessage: 'Task title removed by {user}',
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

interface Props {
  colonyAddress: Address;
  createdAt: Date;
  event: TaskEvents;
}

const renderInteractiveUsername = userRecord => {
  const {
    profile: { displayName, username },
  } = userRecord;
  return (
    <InfoPopover trigger={username ? 'click' : 'disabled'} user={userRecord}>
      <span title={username} className={styles.highlightCursor}>
        {displayName || username}
      </span>
    </InfoPopover>
  );
};

const TaskFeedEventDomainSet = ({
  colonyAddress,
  event: {
    meta: { userAddress },
    payload: { domainId },
  },
  intl: { formatMessage },
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
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
        user: renderInteractiveUsername(userRecord),
      }}
    />
  );
};

const TaskFeedEventCreated = ({
  event: {
    meta: { userAddress },
  },
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.created}
      values={{
        user: renderInteractiveUsername(userRecord),
      }}
    />
  );
};

const TaskFeedEventDueDateSet = ({
  event: {
    meta: { userAddress },
    payload: { dueDate },
  },
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.dueDateSet}
      values={{
        user: renderInteractiveUsername(userRecord),
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
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
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
        user: renderInteractiveUsername(userRecord),
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
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.payoutRemoved}
      values={{
        user: renderInteractiveUsername(userRecord),
      }}
    />
  );
};

const TaskFeedEventSkillSet = ({
  event: {
    meta: { userAddress },
    payload: { skillId },
  },
}: any) => {
  const skill = useMemo(() => taskSkillsTree.find(({ id }) => id === skillId), [
    skillId,
  ]);
  const { name: skillName = undefined } = skill || {};
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.skillSet}
      values={{
        user: renderInteractiveUsername(userRecord),
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
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.cancelled}
      values={{
        user: renderInteractiveUsername(userRecord),
      }}
    />
  );
};

const TaskFeedEventClosed = ({
  event: {
    meta: { userAddress },
  },
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.closed}
      values={{
        user: renderInteractiveUsername(userRecord),
      }}
    />
  );
};

const TaskFeedEventDescriptionSet = ({
  event: {
    meta: { userAddress },
    payload: { description },
  },
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.descriptionSet}
      values={{
        user: renderInteractiveUsername(userRecord),
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
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.finalized}
      values={{
        user: renderInteractiveUsername(userRecord),
      }}
    />
  );
};

const TaskFeedEventTitleSet = ({
  event: {
    meta: { userAddress },
    payload: { title },
  },
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  if (!title) {
    return (
      <FormattedMessage
        {...MSG.titleRemoved}
        values={{
          user: renderInteractiveUsername(userRecord),
        }}
      />
    );
  }
  return (
    <FormattedMessage
      {...MSG.titleSet}
      values={{
        user: renderInteractiveUsername(userRecord),
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
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  const { record: invitedUserRecord } = useSelector(userSelector, [
    workerAddress,
  ]);
  return (
    <FormattedMessage
      {...MSG.workInviteSent}
      values={{
        user: renderInteractiveUsername(userRecord),
        invitedUser: renderInteractiveUsername(invitedUserRecord),
      }}
    />
  );
};

const TaskFeedEventWorkRequestCreated = ({
  event: {
    meta: { userAddress },
  },
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  return (
    <FormattedMessage
      {...MSG.workRequestCreated}
      values={{
        user: renderInteractiveUsername(userRecord),
      }}
    />
  );
};

const TaskFeedEventWorkerAssigned = ({
  event: {
    meta: { userAddress },
    payload: { workerAddress },
  },
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  const { record: workerRecord } = useSelector(userSelector, [workerAddress]);
  return (
    <FormattedMessage
      {...MSG.workerAssigned}
      values={{
        user: renderInteractiveUsername(userRecord),
        worker: renderInteractiveUsername(workerRecord),
      }}
    />
  );
};

const TaskFeedEventWorkerUnassigned = ({
  event: {
    payload: { userAddress, workerAddress },
  },
}: any) => {
  const { record: userRecord } = useSelector(userSelector, [userAddress]);
  const { record: workerRecord } = useSelector(userSelector, [workerAddress]);
  return (
    <FormattedMessage
      {...MSG.workerUnassigned}
      values={{
        user: renderInteractiveUsername(userRecord),
        worker: renderInteractiveUsername(workerRecord),
      }}
    />
  );
};

const FEED_EVENT_COMPONENTS = {
  [EventTypes.DOMAIN_SET]: injectIntl(TaskFeedEventDomainSet),
  [EventTypes.DUE_DATE_SET]: TaskFeedEventDueDateSet,
  [EventTypes.PAYOUT_SET]: TaskFeedEventPayoutSet,
  [EventTypes.PAYOUT_REMOVED]: TaskFeedEventPayoutRemoved,
  [EventTypes.SKILL_SET]: TaskFeedEventSkillSet,
  [EventTypes.TASK_CANCELLED]: TaskFeedEventCancelled,
  [EventTypes.TASK_CLOSED]: TaskFeedEventClosed,
  [EventTypes.TASK_CREATED]: TaskFeedEventCreated,
  [EventTypes.TASK_DESCRIPTION_SET]: TaskFeedEventDescriptionSet,
  [EventTypes.TASK_FINALIZED]: TaskFeedEventFinalized,
  [EventTypes.TASK_TITLE_SET]: TaskFeedEventTitleSet,
  [EventTypes.WORK_INVITE_SENT]: TaskFeedEventWorkInviteSent,
  [EventTypes.WORK_REQUEST_CREATED]: TaskFeedEventWorkRequestCreated,
  [EventTypes.WORKER_ASSIGNED]: TaskFeedEventWorkerAssigned,
  [EventTypes.WORKER_UNASSIGNED]: TaskFeedEventWorkerUnassigned,
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
