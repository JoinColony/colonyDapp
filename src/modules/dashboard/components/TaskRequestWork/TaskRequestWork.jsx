/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { OpenDialog } from '~core/Dialog/types';
import type { UserRecord } from '~immutable';

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
  openDialog: OpenDialog,
  currentUser: UserRecord,
};

const TaskRequestWork = ({
  isTaskCreator,
  openDialog,
  currentUser: {
    didClaimProfile = false,
    profile: { balance },
  },
}: Props) => (
  <Button
    text={MSG.requestWork}
    disabled={!isTaskCreator}
    onClick={() => {
      if (!didClaimProfile) {
        return unfinishedProfileOpener(openDialog, balance);
      }
      return false;
    }}
  />
);

TaskRequestWork.displayName = displayName;

export default withDialog()(TaskRequestWork);
