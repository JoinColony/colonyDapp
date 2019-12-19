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
  useTokenQuery,
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
import { useSelector } from '~utils/hooks';

import { getFriendlyName } from '../../../users/transformers';
import { domainSelector } from '../../selectors';
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
  initiator: {
    profile: { walletAddress },
  },
  intl: { formatMessage },
}: EventProps<SetTaskDomainEvent> & { intl: IntlShape }) => {
  const domain = useSelector(domainSelector, [colonyAddress, ethDomainId]);
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
        user: <InteractiveUsername userAddress={walletAddress} />,
      }}
    />
  );
};

const TaskFeedEventCreated = ({
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<CreateTaskEvent>) => (
  <FormattedMessage
    {...MSG.created}
    values={{
      user: <InteractiveUsername userAddress={walletAddress} />,
    }}
  />
);

const TaskFeedEventDueDateSet = ({
  context: { dueDate },
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<SetTaskDueDateEvent>) => (
  <FormattedMessage
    {...MSG.dueDateSet}
    values={{
      user: <InteractiveUsername userAddress={walletAddress} />,
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
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<SetTaskPayoutEvent>) => {
  const { data } = useTokenQuery({ variables: { address: tokenAddress } });
  const { decimals = 18, symbol = '' } = (data && data.token.details) || {};
  return (
    <FormattedMessage
      {...MSG.payoutSet}
      values={{
        user: <InteractiveUsername userAddress={walletAddress} />,
        payout: (
          <span className={styles.highlightNumeral}>
            <Numeral
              integerSeparator=""
              unit={decimals || 18}
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
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<RemoveTaskPayoutEvent>) => (
  <FormattedMessage
    {...MSG.payoutRemoved}
    values={{
      user: <InteractiveUsername userAddress={walletAddress} />,
    }}
  />
);

const TaskFeedEventSkillSet = ({
  context: { ethSkillId },
  initiator: {
    profile: { walletAddress },
  },
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
        user: <InteractiveUsername userAddress={walletAddress} />,
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
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<CancelTaskEvent>) => (
  <FormattedMessage
    {...MSG.cancelled}
    values={{
      user: <InteractiveUsername userAddress={walletAddress} />,
    }}
  />
);

const TaskFeedEventDescriptionSet = ({
  context: { description },
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<SetTaskDescriptionEvent>) => {
  if (!description) {
    return (
      <FormattedMessage
        {...MSG.descriptionRemoved}
        values={{
          user: <InteractiveUsername userAddress={walletAddress} />,
        }}
      />
    );
  }
  return (
    <FormattedMessage
      {...MSG.descriptionSet}
      values={{
        user: <InteractiveUsername userAddress={walletAddress} />,
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
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<FinalizeTaskEvent>) => (
  <FormattedMessage
    {...MSG.finalized}
    values={{
      user: <InteractiveUsername userAddress={walletAddress} />,
    }}
  />
);

const TaskFeedEventTitleSet = ({
  context: { title },
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<SetTaskTitleEvent>) => {
  if (!title) {
    return (
      <FormattedMessage
        {...MSG.titleRemoved}
        values={{
          user: <InteractiveUsername userAddress={walletAddress} />,
        }}
      />
    );
  }
  return (
    <FormattedMessage
      {...MSG.titleSet}
      values={{
        user: <InteractiveUsername userAddress={walletAddress} />,
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
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<SendWorkInviteEvent>) => (
  <FormattedMessage
    {...MSG.workInviteSent}
    values={{
      user: <InteractiveUsername userAddress={walletAddress} />,
      invitedUser: <InteractiveUsername userAddress={workerAddress} />,
    }}
  />
);

const TaskFeedEventWorkRequestCreated = ({
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<CreateWorkRequestEvent>) => (
  <FormattedMessage
    {...MSG.workRequestCreated}
    values={{
      user: <InteractiveUsername userAddress={walletAddress} />,
    }}
  />
);

const TaskFeedEventWorkerAssigned = ({
  context: { workerAddress },
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<AssignWorkerEvent>) => (
  <FormattedMessage
    {...MSG.workerAssigned}
    values={{
      user: <InteractiveUsername userAddress={walletAddress} />,
      worker: <InteractiveUsername userAddress={workerAddress} />,
    }}
  />
);

const TaskFeedEventWorkerUnassigned = ({
  context: { workerAddress },
  initiator: {
    profile: { walletAddress },
  },
}: EventProps<UnassignWorkerEvent>) => (
  <FormattedMessage
    {...MSG.workerUnassigned}
    values={{
      user: <InteractiveUsername userAddress={walletAddress} />,
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
