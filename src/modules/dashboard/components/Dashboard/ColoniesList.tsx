import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';

const MSG = defineMessages({
  myColonies: {
    id: 'dashboard.Dashboard.ColoniesList.myColonies',
    defaultMessage: `My Colonies`,
  },
});

const displayName = 'dashboard.Dashboard.ColoniesList';

const ColoniesList = () => (
  <Heading text={MSG.myColonies} appearance={{ size: 'small' }} />
);

ColoniesList.displayName = displayName;

export default ColoniesList;
