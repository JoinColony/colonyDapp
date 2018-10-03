/* @flow */
import type { DialogType } from '~core/Dialog';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import DialogProvider from '~core/Dialog/DialogProvider.jsx';
import Heading from '~core/Heading';
import withDialog from '~core/Dialog/withDialog';

import LoadingTemplate from '../../../pages/LoadingTemplate';

const MSG = defineMessages({
  loadingText: {
    id: 'CreateColonyWizard.CreatingColony.loadingText',
    defaultMessage: 'Colony creation...',
  },
  loaderDescription: {
    id: 'CreateColonyWizard.CreatingColony.loaderDescription',
    defaultMessage: 'Please wait while your colony is being created.',
  },
  loaderSubtext: {
    id: 'CreateColonyWizard.CreatingColony.loaderSubtext',
    defaultMessage: 'Your colony is being built as we speak.',
  },
});

type Props = {
  openDialog: (dialogName: string) => DialogType,
};

class CreatingColony extends Component<Props> {
  colonyCreationDialog: DialogType;

  static displayName = 'CreateColonyWizard.CreatingColony';

  componentDidMount() {
    const { openDialog } = this.props;
    // TODO use gas station dialog here once implemented
    this.colonyCreationDialog = openDialog('ActivityBarExample');
  }

  componentWillUnmount() {
    this.colonyCreationDialog.close();
  }

  render() {
    return (
      <DialogProvider>
        <LoadingTemplate loadingText={MSG.loadingText}>
          <Heading
            text={MSG.loaderDescription}
            appearance={{ size: 'medium', weight: 'thin' }}
          />
          <Heading
            text={MSG.loaderSubtext}
            appearance={{ size: 'normal', weight: 'thin' }}
          />
        </LoadingTemplate>
      </DialogProvider>
    );
  }
}

export default withDialog()(CreatingColony);
