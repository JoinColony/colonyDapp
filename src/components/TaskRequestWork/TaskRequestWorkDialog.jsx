/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ConfirmDialog } from '~components/core/Dialog';

const MSG = defineMessages({
  dialogTitle: {
    id: 'dashboard.TaskRequestWork.TaskRequestWorkDialog.dialogTitle',
    defaultMessage: 'Submit a Work Request',
  },
  descriptionText: {
    id: 'dashboard.TaskRequestWork.TaskRequestWorkDialog.descriptionText',
    defaultMessage: `
      Do you want to request to work on this task? The task owner will be
      notified.`,
  },
});

type Props = {|
  cancel: () => void,
  close: () => void,
|};

class TaskRequestWorkDialog extends Component<Props> {
  static displayName = 'dashboard.TaskRequestWork.TaskRequestWorkDialog';

  handleClose = () => {
    const { close } = this.props;
    /* eslint-disable-next-line no-console */
    console.log(TaskRequestWorkDialog.displayName, 'Confirm task work request');
    close();
  };

  render() {
    const {
      props: { cancel },
      handleClose,
    } = this;
    return (
      <ConfirmDialog
        cancel={cancel}
        close={handleClose}
        heading={MSG.dialogTitle}
        confirmButtonText={{ id: 'button.confirm' }}
      >
        <FormattedMessage {...MSG.descriptionText} />
      </ConfirmDialog>
    );
  }
}

export default TaskRequestWorkDialog;
