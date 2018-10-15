/* @flow */
import type { DialogType } from '~core/Dialog';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import DialogProvider from '~core/Dialog/DialogProvider.jsx';
import Heading from '~core/Heading';
import withDialog from '~core/Dialog/withDialog';

import LoadingTemplate from '~pages/LoadingTemplate';

const MSG = defineMessages({
  loadingText: {
    id: 'CreateColonyWizard.CreatingToken.loadingText',
    defaultMessage: 'Token creation...',
  },
  loaderDescription: {
    id: 'CreateColonyWizard.CreatingToken.loaderDescription',
    defaultMessage: 'Please wait while your new token is being created.',
  },
});

type Props = {
  openDialog: string => DialogType,
};

class CreatingToken extends Component<Props> {
  tokenCreationDialog: DialogType;

  static displayName = 'CreateColonyWizard.CreatingToken';

  componentDidMount() {
    const { openDialog } = this.props;
    // TODO use gas station dialog here once implemented
    this.tokenCreationDialog = openDialog('ActivityBarExample');
  }

  componentWillUnmount() {
    this.tokenCreationDialog.close();
  }

  render() {
    return (
      <DialogProvider>
        <LoadingTemplate loadingText={MSG.loadingText}>
          <Heading
            text={MSG.loaderDescription}
            appearance={{ size: 'medium', weight: 'thin' }}
          />
        </LoadingTemplate>
      </DialogProvider>
    );
  }
}

export default withDialog()(CreatingToken);
