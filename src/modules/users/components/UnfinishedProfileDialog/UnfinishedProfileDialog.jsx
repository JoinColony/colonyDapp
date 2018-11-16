/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ConfirmDialog } from '~core/Dialog';

import styles from './UnfinishedProfileDialog.css';

const MSG = defineMessages({
  title: {
    id: 'user.UnfinishedProfileDialog.title',
    defaultMessage: 'Finish setting up your Colony account',
  },
  description: {
    id: 'user.UnfinishedProfileDialog.description',
    defaultMessage: `
      Before working on a task, you'll need to finish setting up your account.
      As soon as you're done, you can begin earning tokens and reputation in
      colonies.`,
  },
  callToAction: {
    id: 'user.UnfinishedProfileDialog.callToAction',
    defaultMessage: `
      You're almost there: click Continue below to create your unique username.
    `,
  },
});

type Props = {
  cancel: () => void,
  close: () => void,
};

class UnfinishedProfileDialog extends Component<Props> {
  static displayName = 'dashboard.UnfinishedProfileDialog';

  handleContinue = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const {
      props: { cancel },
      handleContinue,
    } = this;
    return (
      <ConfirmDialog
        cancel={cancel}
        close={handleContinue}
        heading={MSG.title}
        confirmButtonText={{ id: 'button.continue' }}
      >
        <FormattedMessage {...MSG.description} />
        <p className={styles.cta}>
          <FormattedMessage {...MSG.callToAction} />
        </p>
      </ConfirmDialog>
    );
  }
}

export default UnfinishedProfileDialog;
