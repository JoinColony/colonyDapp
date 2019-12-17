import React, { useMemo } from 'react';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  IntlShape,
} from 'react-intl';
import formatDate from 'sugar-date/date/format';

import { ROOT_DOMAIN } from '~constants';
import { Address } from '~types/index';
import TimeRelative from '~core/TimeRelative';
import Numeral from '~core/Numeral';
import InfoPopover from '~core/InfoPopover';
import styles from '~dashboard/TaskFeed/TaskFeedEvent.css';
import { EventTypes } from '~data/constants';
import {
  useUser,
  AnyUser,
  TaskEventFragment,
  SetTaskDueDateEvent,
  SetTaskSkillEvent,
  CreateTaskEvent,
  SetTaskTitleEvent,
  SetTaskDescriptionEvent,
  SetTaskPayoutEvent,
  RemoveTaskPayoutEvent,
  CancelTaskEvent,
  FinalizeTaskEvent,
  SendWorkInviteEvent,
  CreateWorkRequestEvent,
  AssignWorkerEvent,
  UnassignWorkerEvent,
  SetTaskDomainEvent,
} from '~data/index';
import { useDataFetcher, useSelector } from '~utils/hooks';

import { getFriendlyName } from '../../../users/transformers';
import { domainSelector } from '../../selectors';
import { tokenFetcher } from '../../fetchers';
import taskSkillsTree from '../TaskSkills/taskSkillsTree';

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
  descriptionRemoved: {
    id: 'dashboard.TaskFeedEvent.descriptionRemoved',
    defaultMessage: 'Task description removed by {user}',
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
  event: TaskEventFragment;
}

interface EventProps<C> {
  colonyAddress: Address;
  initiator: AnyUser;
  context: C;
}

interface InteractiveUsernameProps {
  userAddress: Address;
}

const InteractiveUsername = ({ userAddress }: InteractiveUsernameProps) => {
  const user = useUser(userAddress);
  const friendlyName = getFriendlyName(user);
  return (
    <InfoPopover user={user}>
      <span title={friendlyName} className={styles.highlightCursor}>
        {friendlyName}
      </span>
    </InfoPopover>
  );
};

const TaskFeedEventDomainSet = ({
  colonyAddress,
  context: { ethDomainId },
  initiator: { id: initiatorAddress },
  intl: { formatMessage },
}: EventProps<SetTaskDomainEvent> & { intl: IntlShape }) => {
  const domain = useSelector(domainSelector, [
    colonyAddress,
    ethDomainId,
  ]);
  const domainName =
    ethDomainId === ROOT_DOMAIN
      ? formatMessage(MSG.rootDomain)
      : domain && domain.name;
  return (
    <FormattedMessage
      {...MSG.domainSet}
      values={{
        domainName: (
          <span title={domainName} className={styles.highlight}>
            {domainName}
          </span>
        ),
        user: <InteractiveUsername userAddress={initiatorAddress} />,
      }}
    />
  );
};

const TaskFeedEventCreated = ({
  initiator: { id: initiatorAddress },
}: EventProps<CreateTaskEvent>) => (
  <FormattedMessage
    {...MSG.created}
    values={{
      user: <InteractiveUsername userAddress={initiatorAddress} />,
    }}
  />
);

const TaskFeedEventDueDateSet = ({
  context: { dueDate },
  initiator: { id: initiatorAddress },
}: EventProps<SetTaskDueDateEvent>) => (
  <FormattedMessage
    {...MSG.dueDateSet}
    values={{
      user: <InteractiveUsername userAddress={initiatorAddress} />,
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
  context: { amount, tokenAddress },
  initiator: { id: initiatorAddress },
}: EventProps<SetTaskPayoutEvent>) => {
  const { data: token } = useDataFetcher(
    tokenFetcher,
    [tokenAddress],
    [tokenAddress],
  );
  const { decimals = 18, symbol = '' } = token || {};
  return (
    <FormattedMessage
      {...MSG.payoutSet}
      values={{
        user: <InteractiveUsername userAddress={initiatorAddress} />,
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
  initiator: { id: initiatorAddress },
}: EventProps<RemoveTaskPayoutEvent>) => (
  <FormattedMessage
    {...MSG.payoutRemoved}
    values={{
      user: <InteractiveUsername userAddress={initiatorAddress} />,
    }}
  />
);

const TaskFeedEventSkillSet = ({
  context: { ethSkillId },
  initiator: { id: initiatorAddress },
}: EventProps<SetTaskSkillEvent>) => {
  const skill = useMemo(
    () => taskSkillsTree.find(({ id }) => id === ethSkillId),
    [ethSkillId],
  );
  const { name: skillName = undefined } = skill || {};
  return (
    <FormattedMessage
      {...MSG.skillSet}
      values={{
        user: <InteractiveUsername userAddress={initiatorAddress} />,
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
  initiator: { id: initiatorAddress },
}: EventProps<CancelTaskEvent>) => (
  <FormattedMessage
    {...MSG.cancelled}
    values={{
      user: <InteractiveUsername userAddress={initiatorAddress} />,
    }}
  />
);

// fixme is this the same as task cancelled? If so, remove this component
// const TaskFeedEventClosed = ({
//   event: {
//     meta: { userAddress },
//   },
// }: EventProps<>) => (
//   <FormattedMessage
//     {...MSG.closed}
//     values={{
//       user: <InteractiveUsername userAddress={userAddress} />,
//     }}
//   />
// );

const TaskFeedEventDescriptionSet = ({
  context: { description },
  initiator: { id: initiatorAddress },
}: EventProps<SetTaskDescriptionEvent>) => {
  if (!description) {
    return (
      <FormattedMessage
        {...MSG.descriptionRemoved}
        values={{
          user: <InteractiveUsername userAddress={initiatorAddress} />,
        }}
      />
    );
  }
  return (
    <FormattedMessage
      {...MSG.descriptionSet}
      values={{
        user: <InteractiveUsername userAddress={initiatorAddress} />,
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
  initiator: { id: initiatorAddress },
}: EventProps<FinalizeTaskEvent>) => (
  <FormattedMessage
    {...MSG.finalized}
    values={{
      user: <InteractiveUsername userAddress={initiatorAddress} />,
    }}
  />
);

const TaskFeedEventTitleSet = ({
  context: { title },
  initiator: { id: initiatorAddress },
}: EventProps<SetTaskTitleEvent>) => {
  if (!title) {
    return (
      <FormattedMessage
        {...MSG.titleRemoved}
        values={{
          user: <InteractiveUsername userAddress={initiatorAddress} />,
        }}
      />
    );
  }
  return (
    <FormattedMessage
      {...MSG.titleSet}
      values={{
        user: <InteractiveUsername userAddress={initiatorAddress} />,
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
  context: { workerAddress },
  initiator: { id: initiatorAddress },
}: EventProps<SendWorkInviteEvent>) => (
  <FormattedMessage
    {...MSG.workInviteSent}
    values={{
      user: <InteractiveUsername userAddress={initiatorAddress} />,
      invitedUser: <InteractiveUsername userAddress={workerAddress} />,
    }}
  />
);

const TaskFeedEventWorkRequestCreated = ({
  initiator: { id: initiatorAddress },
}: EventProps<CreateWorkRequestEvent>) => (
  <FormattedMessage
    {...MSG.workRequestCreated}
    values={{
      user: <InteractiveUsername userAddress={initiatorAddress} />,
    }}
  />
);

const TaskFeedEventWorkerAssigned = ({
  context: { workerAddress },
  initiator: { id: initiatorAddress },
}: EventProps<AssignWorkerEvent>) => (
  <FormattedMessage
    {...MSG.workerAssigned}
    values={{
      user: <InteractiveUsername userAddress={initiatorAddress} />,
      worker: <InteractiveUsername userAddress={workerAddress} />,
    }}
  />
);

const TaskFeedEventWorkerUnassigned = ({
  context: { workerAddress },
  initiator: { id: initiatorAddress },
}: EventProps<UnassignWorkerEvent>) => (
  <FormattedMessage
    {...MSG.workerUnassigned}
    values={{
      user: <InteractiveUsername userAddress={initiatorAddress} />,
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
  // fixme is this the same as task cancelled?
  // [EventTypes.TASK_CLOSED]: TaskFeedEventClosed,
  [EventTypes.TASK_CREATED]: TaskFeedEventCreated,
  [EventTypes.TASK_DESCRIPTION_SET]: TaskFeedEventDescriptionSet,
  [EventTypes.TASK_FINALIZED]: TaskFeedEventFinalized,
  [EventTypes.TASK_TITLE_SET]: TaskFeedEventTitleSet,
  [EventTypes.WORK_INVITE_SENT]: TaskFeedEventWorkInviteSent,
  [EventTypes.WORK_REQUEST_CREATED]: TaskFeedEventWorkRequestCreated,
  [EventTypes.WORKER_ASSIGNED]: TaskFeedEventWorkerAssigned,
  [EventTypes.WORKER_UNASSIGNED]: TaskFeedEventWorkerUnassigned,
};

const TaskFeedEvent = ({ colonyAddress, event }: Props) => {
  const FeedEventComponent = FEED_EVENT_COMPONENTS[event.context.type];
  if (!FeedEventComponent) {
    console.warn(
      `No task feed event component defined for '${event.context.type}'.`,
    );
    return null;
  }
  return (
    <div className={styles.main}>
      <div className={styles.event}>
        <FeedEventComponent
          initiator={event.initiator}
          colonyAddress={colonyAddress}
          context={event.context}
        />
        &nbsp;
        <TimeRelative value={event.createdAt} />
      </div>
    </div>
  );
};

TaskFeedEvent.displayName = componentDisplayName;

export default TaskFeedEvent;
