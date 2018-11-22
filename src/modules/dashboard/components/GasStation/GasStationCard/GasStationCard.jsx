//* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

const MSG = defineMessages({
  title: {
    id: 'dashboard.GasStation.GasStationCard.title',
    defaultMessage: 'Request Work',
  },
});

const displayName = 'dashboard.GasStation.GasStationCard';

const GasStationCard = () => (
  <div>
    <FormattedMessage {...MSG.title} />
  </div>
);

GasStationCard.displayName = displayName;

export default GasStationCard;
