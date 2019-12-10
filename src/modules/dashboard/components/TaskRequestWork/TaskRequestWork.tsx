import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { History } from 'history';

import { OpenDialog } from '~core/Dialog/types';
import withDialog from '~core/Dialog/withDialog';
import Button from '~core/Button';
import unfinishedProfileOpener from '~users/UnfinishedProfile';
import { useLoggedInUser } from '~data/helpers';
import { AnyTask, useCreateWorkRequestMutation } from '~data/index';

import { canRequestToWork, hasRequestedToWork } from '../../checks';

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
interface Props {
  openDialog: OpenDialog;
  task: AnyTask;
  history: History;
}

const TaskRequestWork = ({
  task: { id: draftId },
  task,
  history,
}: Props) => {
  const { username, walletAddress } = useLoggedInUser();

  const [sendWorkRequest] = useCreateWorkRequestMutation({ variables: { input: { id: draftId } } });

  if (hasRequestedToWork(task, walletAddress)) {
    return (
      <p className={styles.requestSubmittedText}>
        <FormattedMessage {...MSG.workRequestSubmitted} />
      </p>
    );
  }

  if (!!username && canRequestToWork(task, walletAddress)) {
    return (
      <Button
        text={MSG.requestWork}
        onClick={sendWorkRequest}
      />
    );
  }

  return (
    <Button
      text={MSG.requestWork}
      onClick={() => unfinishedProfileOpener(history)}
      data-test="requestWorkButton"
    />
  );
};

TaskRequestWork.displayName = displayName;

export default withDialog()(TaskRequestWork) as any;
