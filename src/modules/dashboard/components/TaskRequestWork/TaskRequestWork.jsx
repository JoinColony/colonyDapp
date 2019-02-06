/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { OpenDialog } from '~core/Dialog/types';

import withDialog from '~core/Dialog/withDialog';
import Button from '~core/Button';
import { unfinishedProfileOpener } from '~users/UnfinishedProfileDialog';

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
  claimedProfile = false,
  openDialog,
}: Props) => (
  <Button
    text={MSG.requestWork}
    disabled={!isTaskCreator}
    onClick={() => {
      if (!claimedProfile) {
        return unfinishedProfileOpener(openDialog);
      }
      return false;
    }}
  />
);

TaskRequestWork.displayName = displayName;

export default withDialog()(TaskRequestWork);
