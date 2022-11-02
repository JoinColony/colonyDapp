import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';
import { capitalize } from '~utils/strings';
import FormattedDateAndTime from './FormattedDateAndTime';

const displayName = 'dashboard.StartStreamDialog.StreamingDetails.EndDate';

const MSG = defineMessages({
  none: {
    id: 'dashboard.StartStreamDialog.StreamingDetails.EndDate.none',
    defaultMessage: 'None',
  },
});

interface Props {
  endDate?: ExpenditureEndDateTypes;
  endDateTime?: number;
}

const EndDate = ({ endDate, endDateTime }: Props) => {
  if (!endDate) {
    return <FormattedMessage {...MSG.none} />;
  }

  return endDate === ExpenditureEndDateTypes.FixedTime && endDateTime ? (
    <FormattedDateAndTime date={endDateTime} />
  ) : (
    <>{capitalize(endDate.replace(/-/g, ' '))}</>
  );
};

EndDate.displayName = displayName;

export default EndDate;
