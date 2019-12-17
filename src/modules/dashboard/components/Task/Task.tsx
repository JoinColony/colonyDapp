import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import compose from 'recompose/compose';

import Button, { ActionButton, ConfirmButton } from '~core/Button';
// Temporary, please remove when wiring in the rating modals
import { OpenDialog } from '~core/Dialog/types';
import withDialog from '~core/Dialog/withDialog';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import TaskAssignment from '~dashboard/TaskAssignment';
import TaskComments from '~dashboard/TaskComments';
import TaskDate from '~dashboard/TaskDate';
import TaskDescription from '~dashboard/TaskDescription';
import TaskDomains from '~dashboard/TaskDomains';
import TaskFeed from '~dashboard/TaskFeed';
import TaskRequestWork from '~dashboard/TaskRequestWork';
import TaskSkills from '~dashboard/TaskSkills';
import TaskTitle from '~dashboard/TaskTitle';

import {
  canCancelTask,
  canFinalizeTask,
  isCancelled,
  canRequestToWork,
  isFinalized,
} from '../../checks';
import { useLoggedInUser } from '~data/helpers';
import { AnyColony, useTaskQuery, useCancelTaskMutation } from '~data/index';
import LoadingTemplate from '~pages/LoadingTemplate';
import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import styles from './Task.css';

const MSG = defineMessages({
  assignmentFunding: {
    id: 'dashboard.Task.assignmentFunding',
    defaultMessage: 'Assignee and Payout',
  },
  details: {
    id: 'dashboard.Task.details',
    defaultMessage: 'Details',
  },
  backButton: {
    id: 'dashboard.Task.backButton',
    defaultMessage: 'Go to {name}',
  },
  completed: {
    id: 'dashboard.Task.completed',
    defaultMessage: 'Task completed',
  },
  discarded: {
    id: 'dashboard.Task.discarded',
    defaultMessage: 'Task discarded',
  },
  finalizeTask: {
    id: 'dashboard.Task.finalizeTask',
    defaultMessage: 'Finalize task',
  },
  discardTask: {
    id: 'dashboard.Task.discardTask',
    defaultMessage: 'Discard task',
  },
  confirmText: {
    id: 'dashboard.Task.confirmText',
    defaultMessage: 'Are you sure you want to discard this task?',
  },
  loadingText: {
    id: 'dashboard.Task.loadingText',
    defaultMessage: 'Loading task',
  },
  trustInfoTooltipHeading: {
    id: 'dashboard.Task.trustInfoTooltipHeading',
    defaultMessage: 'Task data is not stored on chain',
  },
  trustInfoTooltipBody: {
    id: 'dashboard.Task.trustInfoTooltipBody',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Admins can edit the task and remove the assignee without consent. Protect your work and ensure you trust whom you are working with.',
  },
  payoutInfo: {
    id: 'dashboard.Task.payoutInfo',
    defaultMessage:
      // eslint-disable-next-line max-len
      "Each task has its own funding pot which allows you to set aside funds for payouts. The payouts for each role will be taken from the task's funding pot. The Colony fee will be deducted from each payout once the task is completed.",
  },
  helpIconTitle: {
    id: 'dashboard.Task.helpIconTitle',
    defaultMessage: 'Help',
  },
});

interface MatchProps {
  draftId: string;
  colonyName: string;
}

interface Props extends RouteComponentProps<MatchProps> {
  openDialog: OpenDialog;
  history: any;
}

const displayName = 'dashboard.Task';

const Task = ({
  match: {
    params: { draftId },
  },
  openDialog,
  history,
}: Props) => {
  const [isDiscardConfirmDisplayed, setDiscardConfirmDisplay] = useState(false);

  const { walletAddress } = useLoggedInUser();

  const { data } = useTaskQuery({
    // @todo use subscription for `Task` instead of `pollInterval` (once supported by server)
    pollInterval: 2000,
    variables: { id: draftId },
  });

  const {
    task: {
      colony = {} as AnyColony,
      description = undefined,
      ethDomainId = undefined,
      dueDate = undefined,
      ethSkillId = undefined,
      title = undefined,
    } = {},
    task,
  } = data || {};

  // fixme add domains back in here once ready
  // const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
  //   domainsAndRolesFetcher,
  //   [colonyAddress],
  //   [colonyAddress],
  // );

  // fixme add user roles back in here once ready
  // const userRoles = useTransformer(getUserRoles, [
  //   domains,
  //   ethDomainId || null,
  //   walletAddress,
  // ]);
  const userRoles = [];

  const onEditTask = useCallback(() => {
    // If you've managed to click on the button that runs this without the
    // task being fetched yet, you are a wizard
    if (!task) {
      return;
    }

    openDialog('TaskEditDialog', {
      draftId,
      maxTokens: 1,
      minTokens: 0,
    });
  }, [draftId, openDialog, task]);

  const transform = useCallback(
    mergePayload({
      colonyAddress: colony ? colony.colonyAddress : '',
      draftId,
    }),
    [colony, draftId],
  );

  const [handleCancelTask] = useCancelTaskMutation({
    variables: { input: { id: draftId } },
  });

  if (
    // fixme isFetchingDomains
    // isFetchingDomains ||
    !task ||
    !colony ||
    // fixme !domains
    // !domains ||
    !walletAddress
  ) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  // fixme handle edit check here
  const canEdit = true;
  // const canEdit = canEditTask(task, userRoles);

  return (
    <div className={styles.main}>
      <aside className={styles.sidebar}>
        <section className={styles.section}>
          <header className={styles.headerAside}>
            <Heading
              appearance={{ size: 'normal' }}
              text={MSG.assignmentFunding}
            />
            <Tooltip
              placement="right"
              content={
                <div className={styles.tooltipText}>
                  <FormattedMessage {...MSG.payoutInfo} />
                </div>
              }
            >
              <button className={styles.helpButton} type="button">
                <Icon
                  appearance={{
                    size: 'small',
                    theme: 'invert',
                  }}
                  name="question-mark"
                  title={MSG.helpIconTitle}
                />
              </button>
            </Tooltip>
          </header>
          <div className={styles.assignment}>
            <div>
              <TaskAssignment
                colonyAddress={colony.colonyAddress}
                draftId={draftId}
              />
            </div>
            {canEdit && (
              <div className={styles.assignmentDetailsButton}>
                <Button
                  appearance={{ theme: 'blue' }}
                  text={MSG.details}
                  onClick={onEditTask}
                />
              </div>
            )}
          </div>
        </section>
        <section className={styles.section}>
          <TaskTitle
            disabled={!canEdit}
            draftId={draftId}
            title={title || undefined}
          />
          <TaskDescription
            description={description || undefined}
            disabled={!canEdit}
            draftId={draftId}
          />
        </section>
        {!!(canEdit || dueDate || ethDomainId || ethSkillId) && (
          <section className={styles.section}>
            {colony && colony.colonyAddress && (
              <div className={styles.editor}>
                <TaskDomains
                  colonyAddress={colony.colonyAddress}
                  // Disable the change of domain for now
                  disabled
                  ethDomainId={ethDomainId}
                  draftId={draftId}
                />
              </div>
            )}
            <div className={styles.editor}>
              <TaskSkills
                disabled={!canEdit}
                draftId={draftId}
                ethSkillId={ethSkillId || undefined}
              />
            </div>
            <div className={styles.editor}>
              <TaskDate
                disabled={!canEdit}
                draftId={draftId}
                dueDate={dueDate || undefined}
              />
            </div>
          </section>
        )}
      </aside>
      <div className={styles.container}>
        <section
          className={`${styles.header} ${
            isDiscardConfirmDisplayed ? styles.headerConfirm : ''
          }`}
        >
          {!isDiscardConfirmDisplayed && (
            <Tooltip
              content={
                <div className={styles.trustInfoTooltip}>
                  <p className={styles.trustInfoTooltipHeading}>
                    <FormattedMessage {...MSG.trustInfoTooltipHeading} />
                  </p>
                  <p>
                    <FormattedMessage {...MSG.trustInfoTooltipBody} />
                  </p>
                </div>
              }
              placement="right"
            >
              <div className={styles.trustInfoIcon}>
                <Icon
                  name="unlock"
                  /*
                   * Set to an empty string to prevent rendering
                   * Otherwise it will overlap with the tooltip which is already
                   * providing this functionality
                   */
                  title=""
                  appearance={{ size: 'small', theme: 'primary' }}
                />
              </div>
            </Tooltip>
          )}
          {canCancelTask(task, userRoles) && (
            <Button
              appearance={{ theme: 'secondary', size: 'small' }}
              button={ConfirmButton}
              confirmText={MSG.confirmText}
              onClick={handleCancelTask}
              onConfirmToggled={setDiscardConfirmDisplay}
              text={MSG.discardTask}
            />
          )}
          {/* Hide when discard confirm is displayed */}
          {!isDiscardConfirmDisplayed && (
            <>
              {canFinalizeTask(task, userRoles) && (
                <ActionButton
                  text={MSG.finalizeTask}
                  submit={ActionTypes.TASK_FINALIZE}
                  error={ActionTypes.TASK_FINALIZE_ERROR}
                  success={ActionTypes.TASK_FINALIZE_SUCCESS}
                  transform={transform}
                />
              )}
              {isFinalized(task) && (
                <p className={styles.completedDescription}>
                  <FormattedMessage {...MSG.completed} />
                </p>
              )}
              {isCancelled(task) && (
                <p className={styles.completedDescription}>
                  <FormattedMessage {...MSG.discarded} />
                </p>
              )}
              {canRequestToWork(task, walletAddress) && (
                <TaskRequestWork task={task} history={history} />
              )}
            </>
          )}
          {/*
           Use these components for the full on-chain task workflow
           <TaskRatingButtons task={task} />
           <TaskClaimReward task={task} />
          */}
        </section>
        <div className={styles.activityContainer}>
          <section className={styles.activity}>
            <TaskFeed colonyAddress={colony.colonyAddress} draftId={draftId} />
          </section>
          <section className={styles.commentBox}>
            <TaskComments
              colonyAddress={colony.colonyAddress}
              draftId={draftId}
              taskTitle={title}
              history={history}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

Task.displayName = displayName;

const enhance = compose(
  withDialog(),
  withRouter,
) as any;

export default enhance(Task);
