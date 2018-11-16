/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { OpenDialog } from '~core/Dialog/types';

import withDialog from '~core/Dialog/withDialog';
import Button from '~core/Button';

const MSG = defineMessages({
  requestWork: {
    id: 'dashboard.TaskRequestWork.requestWork',
    defaultMessage: 'Request Work',
  },
});

const displayName = 'dashboard.TaskRequestWork';

type Props = {
  /*
   * @TODO Interaction for this button if the user is the task creator
   */
  isTaskCreator: boolean,
  /*
   * If the user hasn't yet claimed the profile show the call to action dialog,
   * and prevent normal functionality of requesting to work on the task
   */
  claimedProfile: boolean,
  openDialog: OpenDialog,
};

const TaskRequestWork = ({
  isTaskCreator,
  claimedProfile,
  openDialog,
}: Props) => (
  <Button
    text={MSG.requestWork}
    disabled={isTaskCreator}
    onClick={() => {
      if (!claimedProfile) {
        return openDialog('UnfinishedProfileDialog')
          .afterClosed()
          .then(() => openDialog('CreateUsernameDialog'));
      }
      return openDialog('TaskRequestWorkDialog');
    }}
  />
);

TaskRequestWork.displayName = displayName;

export default withDialog()(TaskRequestWork);
