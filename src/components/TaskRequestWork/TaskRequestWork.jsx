/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { OpenDialog } from '~components/core/Dialog/types';
import type { UserType } from '~immutable';

import { userDidClaimProfile } from '../../immutable/utils';
import withDialog from '~components/core/Dialog/withDialog';
import Button from '~components/core/Button';
import { unfinishedProfileOpener } from '~components/UnfinishedProfileDialog';

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
  />
);

TaskRequestWork.displayName = displayName;

export default withDialog()(TaskRequestWork);
