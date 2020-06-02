import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import moveDecimal from 'move-decimal-point';
import { bigNumberify } from 'ethers/utils';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { Address } from '~types/index';
import TimeRelative from '~core/TimeRelative';
import Numeral from '~core/Numeral';
import InfoPopover from '~core/InfoPopover';
import TransactionLink from '~core/TransactionLink';
import styles from '~dashboard/TaskFeed/TaskFeedEvent.css';
import {
  useUser,
  useTokenQuery,
  useColonyQuery,
  useDomainQuery,
  AnyUser,
  EventType,
  TaskEventFragment,
  SetTaskDueDateEvent,
  SetTaskSkillEvent,
  RemoveTaskSkillEvent,
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
  SetTaskPendingEvent,
} from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { getFriendlyName } from '../../../users/transformers';
import taskSkillsTree from '../TaskSkills/taskSkillsTree';
import { SpinnerLoader } from '~core/Preloaders';

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
    defaultMessage: `Task skill set to {skillName} by {user}`,
  },
  skillRemoved: {
    id: 'dashboard.TaskFeedEvent.skillRemoved',
    defaultMessage: `Task skill was removed by {user}`,
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
  pending: {
    id: 'dashboard.TaskFeedEvent.pending',
    defaultMessage: 'Task payment initiated by {user} via transaction {txHash}',
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
  domainId?: number;
}

interface InteractiveUsernameProps {
  colonyAddress: Address;
  domainId: number | undefined;
  userAddress: Address;
}

const InteractiveUsername = ({
  colonyAddress,
  domainId,
  userAddress,
}: InteractiveUsernameProps) => {
  const user = useUser(userAddress);
  const friendlyName = getFriendlyName(user);
  return (
    <InfoPopover
      colonyAddress={colonyAddress}
      domainId={domainId}
      user={user}
      popperProps={{ strategy: 'fixed' }}
    >
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
  domainId,
}: EventProps<SetTaskDomainEvent>) => {
  const { formatMessage } = useIntl();
  const { data } = useDomainQuery({
    variables: { colonyAddress, ethDomainId },
  });
  const domainName =
    ethDomainId === ROOT_DOMAIN_ID
      ? formatMessage(MSG.rootDomain)
      : data && data.domain && data.domain.name;
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
          <InteractiveUsername
            colonyAddress={colonyAddress}
            userAddress={walletAddress}
            domainId={domainId}
          />
        ),
      }}
    />
  );
};

const TaskFeedEventCreated = ({
  colonyAddress,
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<CreateTaskEvent>) => (
  <FormattedMessage
    {...MSG.created}
    values={{
      user: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={walletAddress}
        />
      ),
    }}
  />
);

const TaskFeedEventDueDateSet = ({
  colonyAddress,
  context: { dueDate },
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<SetTaskDueDateEvent>) => {
  const { formatDate } = useIntl();
  const formattedDate = formatDate(new Date(dueDate), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return (
    <FormattedMessage
      {...MSG.dueDateSet}
      values={{
        user: (
          <InteractiveUsername
            colonyAddress={colonyAddress}
            domainId={domainId}
            userAddress={walletAddress}
          />
        ),
        dueDate: dueDate && (
          <span title={formattedDate} className={styles.highlight}>
            {formattedDate}
          </span>
        ),
        dueDateSet: !!dueDate,
      }}
    />
  );
};

const TaskFeedEventPayoutSet = ({
  colonyAddress,
  context: { amount, tokenAddress },
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<SetTaskPayoutEvent>) => {
  const { data: tokenData } = useTokenQuery({
    variables: { address: tokenAddress },
  });
  const { data: colonyData } = useColonyQuery({
    variables: { address: colonyAddress },
  });
  const { decimals = DEFAULT_TOKEN_DECIMALS, symbol = '', address = '' } =
    (tokenData && tokenData.token) || {};
  const { nativeTokenAddress = '' } = (colonyData && colonyData.colony) || {};
  if (!tokenData) {
    return <SpinnerLoader />;
  }
  return (
    <FormattedMessage
      {...MSG.payoutSet}
      values={{
        user: (
          <InteractiveUsername
            colonyAddress={colonyAddress}
            domainId={domainId}
            userAddress={walletAddress}
          />
        ),
        payout: (
          <InfoPopover
            token={tokenData.token}
            isTokenNative={address === nativeTokenAddress}
          >
            <span className={styles.highlightNumeral}>
              <Numeral
                integerSeparator=""
                unit={getTokenDecimalsWithFallback(decimals)}
                value={bigNumberify(
                  moveDecimal(amount, getTokenDecimalsWithFallback(decimals)),
                )}
                suffix={` ${symbol}`}
              />
            </span>
          </InfoPopover>
        ),
      }}
    />
  );
};

const TaskFeedEventPayoutRemoved = ({
  colonyAddress,
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<RemoveTaskPayoutEvent>) => (
  <FormattedMessage
    {...MSG.payoutRemoved}
    values={{
      user: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={walletAddress}
        />
      ),
    }}
  />
);

const TaskFeedEventSkillSet = ({
  colonyAddress,
  context: { ethSkillId },
  initiator: {
    profile: { walletAddress },
  },
  domainId,
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
        user: (
          <InteractiveUsername
            colonyAddress={colonyAddress}
            domainId={domainId}
            userAddress={walletAddress}
          />
        ),
        skillName: (
          <span title={skillName} className={styles.highlight}>
            {skillName}
          </span>
        ),
      }}
    />
  );
};

const TaskFeedEventSkillRemoved = ({
  colonyAddress,
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<RemoveTaskSkillEvent>) => {
  return (
    <FormattedMessage
      {...MSG.skillRemoved}
      values={{
        user: (
          <InteractiveUsername
            colonyAddress={colonyAddress}
            domainId={domainId}
            userAddress={walletAddress}
          />
        ),
      }}
    />
  );
};

const TaskFeedEventCancelled = ({
  colonyAddress,
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<CancelTaskEvent>) => (
  <FormattedMessage
    {...MSG.cancelled}
    values={{
      user: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={walletAddress}
        />
      ),
    }}
  />
);

const TaskFeedEventDescriptionSet = ({
  colonyAddress,
  context: { description },
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<SetTaskDescriptionEvent>) => {
  if (!description) {
    return (
      <FormattedMessage
        {...MSG.descriptionRemoved}
        values={{
          user: (
            <InteractiveUsername
              colonyAddress={colonyAddress}
              domainId={domainId}
              userAddress={walletAddress}
            />
          ),
        }}
      />
    );
  }
  return (
    <FormattedMessage
      {...MSG.descriptionSet}
      values={{
        user: (
          <InteractiveUsername
            colonyAddress={colonyAddress}
            domainId={domainId}
            userAddress={walletAddress}
          />
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
  colonyAddress,
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<FinalizeTaskEvent>) => (
  <FormattedMessage
    {...MSG.finalized}
    values={{
      user: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={walletAddress}
        />
      ),
    }}
  />
);

const TaskFeedEventTitleSet = ({
  colonyAddress,
  context: { title },
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<SetTaskTitleEvent>) => {
  if (!title) {
    return (
      <FormattedMessage
        {...MSG.titleRemoved}
        values={{
          user: (
            <InteractiveUsername
              colonyAddress={colonyAddress}
              domainId={domainId}
              userAddress={walletAddress}
            />
          ),
        }}
      />
    );
  }
  return (
    <FormattedMessage
      {...MSG.titleSet}
      values={{
        user: (
          <InteractiveUsername
            colonyAddress={colonyAddress}
            domainId={domainId}
            userAddress={walletAddress}
          />
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
  colonyAddress,
  context: { workerAddress },
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<SendWorkInviteEvent>) => (
  <FormattedMessage
    {...MSG.workInviteSent}
    values={{
      user: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={walletAddress}
        />
      ),
      invitedUser: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={workerAddress}
        />
      ),
    }}
  />
);

const TaskFeedEventWorkRequestCreated = ({
  colonyAddress,
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<CreateWorkRequestEvent>) => (
  <FormattedMessage
    {...MSG.workRequestCreated}
    values={{
      user: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={walletAddress}
        />
      ),
    }}
  />
);

const TaskFeedEventWorkerAssigned = ({
  colonyAddress,
  context: { workerAddress },
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<AssignWorkerEvent>) => (
  <FormattedMessage
    {...MSG.workerAssigned}
    values={{
      user: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={walletAddress}
        />
      ),
      worker: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={workerAddress}
        />
      ),
    }}
  />
);

const TaskFeedEventWorkerUnassigned = ({
  colonyAddress,
  context: { workerAddress },
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<UnassignWorkerEvent>) => (
  <FormattedMessage
    {...MSG.workerUnassigned}
    values={{
      user: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={walletAddress}
        />
      ),
      worker: (
        <InteractiveUsername
          colonyAddress={colonyAddress}
          domainId={domainId}
          userAddress={workerAddress}
        />
      ),
    }}
  />
);

const TaskFeedEventPending = ({
  colonyAddress,
  context: { txHash },
  initiator: {
    profile: { walletAddress },
  },
  domainId,
}: EventProps<SetTaskPendingEvent>) => {
  return (
    <FormattedMessage
      {...MSG.pending}
      values={{
        user: (
          <InteractiveUsername
            colonyAddress={colonyAddress}
            domainId={domainId}
            userAddress={walletAddress}
          />
        ),
        txHash: (
          <TransactionLink hash={txHash} className={styles.highlightTxHash} />
        ),
      }}
    />
  );
};

const FEED_EVENT_COMPONENTS = {
  [EventType.SetTaskDomain]: TaskFeedEventDomainSet,
  [EventType.SetTaskDueDate]: TaskFeedEventDueDateSet,
  [EventType.SetTaskPayout]: TaskFeedEventPayoutSet,
  [EventType.RemoveTaskPayout]: TaskFeedEventPayoutRemoved,
  [EventType.SetTaskSkill]: TaskFeedEventSkillSet,
  [EventType.RemoveTaskSkill]: TaskFeedEventSkillRemoved,
  [EventType.CancelTask]: TaskFeedEventCancelled,
  [EventType.CreateTask]: TaskFeedEventCreated,
  [EventType.SetTaskDescription]: TaskFeedEventDescriptionSet,
  [EventType.FinalizeTask]: TaskFeedEventFinalized,
  [EventType.SetTaskTitle]: TaskFeedEventTitleSet,
  [EventType.SendWorkInvite]: TaskFeedEventWorkInviteSent,
  [EventType.CreateWorkRequest]: TaskFeedEventWorkRequestCreated,
  [EventType.AssignWorker]: TaskFeedEventWorkerAssigned,
  [EventType.UnassignWorker]: TaskFeedEventWorkerUnassigned,
  [EventType.SetTaskPending]: TaskFeedEventPending,
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
