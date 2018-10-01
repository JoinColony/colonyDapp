/* @flow */
import React from 'react';
import { defineMessages } from 'react-intl';
import { compose, lifecycle } from 'recompose';

import DialogProvider from '~core/Dialog/DialogProvider.jsx';
import Heading from '~core/Heading';
import withDialog from '~core/Dialog/withDialog';

import LoadingTemplate from '../../../pages/LoadingTemplate';

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

const displayName = 'CreateColonyWizard.CreatingToken';

const CreatingToken = () => (
  <DialogProvider>
    <LoadingTemplate loadingText={MSG.loadingText}>
      <Heading
        text={MSG.loaderDescription}
        appearance={{ size: 'medium', weight: 'thin' }}
      />
    </LoadingTemplate>
  </DialogProvider>
);

CreatingToken.displayName = displayName;

const enhance = compose(
  withDialog(),
  lifecycle({
    componentDidMount() {
      const { openDialog } = this.props;
      openDialog('ActivityBarExample');
    },
  }),
);

export default enhance(CreatingToken);
