/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ConfirmDialog } from '~core/Dialog';

const MSG = defineMessages({
  title: {
    id: 'admin.RecoveryModeDialog.title',
    defaultMessage: 'Warning!',
  },
  description: {
    id: 'admin.RecoveryModeDialog.description',
    defaultMessage: `
      Your Colony will be disabled and all users will be unable to interact
      with your Colony. Exiting recovery mode requires you to interact directly
      with the contracts. This is an advanced feature and should only be used
      in emergencies.`,
  },
  recoveryModeButton: {
    id: 'admin.RecoveryModeDialog.recoveryModeButton',
    defaultMessage: 'Enter Recovery Mode',
  },
});

type Props = {
  cancel: () => void,
  close: () => void,
};

class RecoveryModeDialog extends Component<Props> {
  static displayName = 'admin.RecoveryModeDialog';

  handleEnterRecovery = () => {
    const { close } = this.props;
    /*
     * @TODO Actually set the colony in recovery mode
     */
    close();
  };

  render() {
    const {
      props: { cancel },
      handleEnterRecovery,
    } = this;
    return (
      <ConfirmDialog
        appearance={{ theme: 'danger' }}
        cancel={cancel}
        close={handleEnterRecovery}
        heading={MSG.title}
        confirmButtonText={MSG.recoveryModeButton}
      >
        <FormattedMessage {...MSG.description} />
      </ConfirmDialog>
    );
  }
}

export default RecoveryModeDialog;
