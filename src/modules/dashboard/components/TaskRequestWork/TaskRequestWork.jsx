/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { OpenDialog } from '~core/Dialog/types';
import type { UserType } from '~immutable';

import { userDidClaimProfile } from '~immutable/utils';
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

// Can't seal this object because of withConsumerFactory
type Props = {
  /*
   * @TODO Interaction for this button if the user is the task creator
   */
  isTaskCreator: boolean,
  openDialog: OpenDialog,
  currentUser: UserType,
};

const TaskRequestWork = ({
  isTaskCreator,
  openDialog,
  currentUser: {
    profile: { balance },
  },
  currentUser,
}: Props) => (
  <Button
    text={MSG.requestWork}
    disabled={!isTaskCreator}
    onClick={() =>
      userDidClaimProfile(currentUser) ||
      unfinishedProfileOpener(openDialog, balance)
    }
    data-test="requestWorkButton"
  />
);

TaskRequestWork.displayName = displayName;

export default withDialog()(TaskRequestWork);
