import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import formatDate from 'sugar-date/date/format';
import { TaskEvents } from '~data/types/TaskEvents';

import { Address } from '~types/index';
import { TokenType, User } from '~immutable/index';
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

interface InteractiveUsernameProps {
  userAddress: Address;
}

const InteractiveUsername = ({ userAddress }: InteractiveUsernameProps) => {
  const { record: { profile: { displayName, username } } = User().toJS() } =
    useSelector(userSelector, [userAddress]) || {};
  return (
    <InfoPopover address={userAddress}>
      <span
        title={displayName || username || userAddress}
        className={styles.highlightCursor}
      >
        {displayName || username || userAddress}
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
        user: <InteractiveUsername userAddress={userAddress} />,
      }}
    />
  );
};

const TaskFeedEventCreated = ({
  event: {
    meta: { userAddress },
  },
}: any) => (
  <FormattedMessage
    {...MSG.created}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
    }}
  />
);

const TaskFeedEventDueDateSet = ({
  event: {
    meta: { userAddress },
    payload: { dueDate },
  },
}: any) => (
  <FormattedMessage
    {...MSG.dueDateSet}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
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

const TaskFeedEventPayoutSet = ({
  event: {
    meta: { userAddress },
    payload: { amount, token: tokenAddress },
  },
}: any) => {
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
        user: <InteractiveUsername userAddress={userAddress} />,
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
}: any) => (
  <FormattedMessage
    {...MSG.payoutRemoved}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
    }}
  />
);

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
  return (
    <FormattedMessage
      {...MSG.skillSet}
      values={{
        user: <InteractiveUsername userAddress={userAddress} />,
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
}: any) => (
  <FormattedMessage
    {...MSG.cancelled}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
    }}
  />
);

const TaskFeedEventClosed = ({
  event: {
    meta: { userAddress },
  },
}: any) => (
  <FormattedMessage
    {...MSG.closed}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
    }}
  />
);

const TaskFeedEventDescriptionSet = ({
  event: {
    meta: { userAddress },
    payload: { description },
  },
}: any) => (
  <FormattedMessage
    {...MSG.descriptionSet}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
      description: (
        <span title={description} className={styles.highlight}>
          {description}
        </span>
      ),
    }}
  />
);

const TaskFeedEventFinalized = ({
  event: {
    meta: { userAddress },
  },
}: any) => (
  <FormattedMessage
    {...MSG.finalized}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
    }}
  />
);

const TaskFeedEventTitleSet = ({
  event: {
    meta: { userAddress },
    payload: { title },
  },
}: any) => {
  if (!title) {
    return (
      <FormattedMessage
        {...MSG.titleRemoved}
        values={{
          user: <InteractiveUsername userAddress={userAddress} />,
        }}
      />
    );
  }
  return (
    <FormattedMessage
      {...MSG.titleSet}
      values={{
        user: <InteractiveUsername userAddress={userAddress} />,
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
}: any) => (
  <FormattedMessage
    {...MSG.workInviteSent}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
      invitedUser: <InteractiveUsername userAddress={workerAddress} />,
    }}
  />
);

const TaskFeedEventWorkRequestCreated = ({
  event: {
    meta: { userAddress },
  },
}: any) => (
  <FormattedMessage
    {...MSG.workRequestCreated}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
    }}
  />
);

const TaskFeedEventWorkerAssigned = ({
  event: {
    meta: { userAddress },
    payload: { workerAddress },
  },
}: any) => (
  <FormattedMessage
    {...MSG.workerAssigned}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
      worker: <InteractiveUsername userAddress={workerAddress} />,
    }}
  />
);

const TaskFeedEventWorkerUnassigned = ({
  event: {
    payload: { userAddress, workerAddress },
  },
}: any) => (
  <FormattedMessage
    {...MSG.workerUnassigned}
    values={{
      user: <InteractiveUsername userAddress={userAddress} />,
      worker: <InteractiveUsername userAddress={workerAddress} />,
    }}
  />
);

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
