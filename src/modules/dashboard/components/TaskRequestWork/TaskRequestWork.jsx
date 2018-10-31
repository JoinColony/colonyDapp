/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { DialogType } from '~core/Dialog';

import withDialog from '~core/Dialog/withDialog';
import Button from '~core/Button';

import styles from './TaskRequestWork.css';

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
  isTaskCreator?: boolean,
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
};

const TaskRequestWork = ({ isTaskCreator = false, openDialog }: Props) => (
  <div className={styles.main}>
    <Button
      text={MSG.requestWork}
      disabled={isTaskCreator}
      onClick={() => openDialog('TaskRequestWorkDialog')}
    />
  </div>
);

TaskRequestWork.displayName = displayName;

export default withDialog()(TaskRequestWork);
