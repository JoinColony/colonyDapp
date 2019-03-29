/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { OpenDialog } from '~core/Dialog/types';
import type { TaskType, UserType } from '~immutable';

import withDialog from '~core/Dialog/withDialog';
import Button, { ActionButton } from '~core/Button';
import { unfinishedProfileOpener } from '~users/UnfinishedProfileDialog';
import { ACTIONS } from '~redux';

import { hasRequestedToWork } from '../../checks';
import { userDidClaimProfile } from '../../../users/checks';

import styles from './TaskRequestWork.css';

const MSG = defineMessages({
  requestWork: {
    id: 'dashboard.TaskRequestWork.requestWork',
    defaultMessage: 'Request to work',
  },
  workRequestSubmitted: {
    id: 'dashboard.TaskRequestWork.workRequestSubmitted',
    defaultMessage: 'Work request submitted',
  },
});

const displayName = 'dashboard.TaskRequestWork';

// Can't seal this object because of withConsumerFactory
type Props = {
  openDialog: OpenDialog,
  currentUser: UserType,
  task: TaskType,
};

const TaskRequestWork = ({
  openDialog,
  currentUser: {
    profile: { balance, walletAddress: address },
  },
  currentUser,
  task: { colonyENSName, draftId },
  task,
}: Props) => {
  if (hasRequestedToWork(task, address))
    return (
      <p className={styles.requestSubmittedText}>
        <FormattedMessage {...MSG.workRequestSubmitted} />
      </p>
    );

  if (userDidClaimProfile(currentUser))
    return (
      <ActionButton
        text={MSG.requestWork}
        submit={ACTIONS.TASK_SEND_WORK_REQUEST}
        error={ACTIONS.TASK_SEND_WORK_REQUEST_ERROR}
        success={ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS}
        values={{
          colonyENSName,
          draftId,
        }}
      />
    );

  return (
    <Button
      text={MSG.requestWork}
      onClick={() => unfinishedProfileOpener(openDialog, balance)}
      data-test="requestWorkButton"
    />
  );
};

TaskRequestWork.displayName = displayName;

export default withDialog()(TaskRequestWork);
