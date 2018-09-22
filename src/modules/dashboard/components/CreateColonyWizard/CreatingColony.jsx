/* @flow */
import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';

import LoadingTemplate from '../../../pages/LoadingTemplate';

const MSG = defineMessages({
  loadingText: {
    id: 'CreateColonyWizard.CreatingColony.loadingText',
    defaultMessage: 'Token creation...',
  },
  loaderDescription: {
    id: 'CreateColonyWizard.CreatingColony.loaderDescription',
    defaultMessage: 'Please wait while your new token is being created.',
  },
});

const displayName = 'CreateColonyWizard.CreatingColony';

const CreatingColony = () => (
  <LoadingTemplate loadingText={MSG.loadingText}>
    <Heading text={MSG.loaderDescription} appearance={{ size: 'small' }} />
  </LoadingTemplate>
);

CreatingColony.displayName = displayName;

export default CreatingColony;
