/* @flow */
import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';

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
  <LoadingTemplate loadingText={MSG.loadingText}>
    <Heading
      text={MSG.loaderDescription}
      appearance={{ size: 'medium', weight: 'thin' }}
    />
  </LoadingTemplate>
);

CreatingToken.displayName = displayName;

export default CreatingToken;
