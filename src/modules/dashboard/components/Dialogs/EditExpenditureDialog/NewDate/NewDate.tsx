import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DatePickerFieldValue } from '~core/Fields/DatePicker/DatePicker';
import EndDate from '~dashboard/Dialogs/StartStreamDialog/StreamingDetails/EndDate';
import FormattedDateAndTime from '~dashboard/Dialogs/StartStreamDialog/StreamingDetails/FormattedDateAndTime';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';

import styles from './NewDate.css';

export const MSG = defineMessages({
  none: {
    id: 'dashboard.EditExpenditureDialog.NewDate.none',
    defaultMessage: 'None',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.NewDate';

interface Props {
  newValue: DatePickerFieldValue;
}

const NewDate = ({ newValue }: Props) => {
  if (!newValue) {
    return (
      <div className={styles.row}>
        <FormattedMessage {...MSG.none} />
      </div>
    );
  }

  if (newValue.option) {
    return (
      <div className={styles.row}>
        <EndDate
          endDate={newValue.option as ExpenditureEndDateTypes}
          endDateTime={newValue.date.getTime()}
        />
      </div>
    );
  }

  return (
    <div className={styles.row}>
      <FormattedDateAndTime date={newValue.date.getTime()} />
    </div>
  );
};

NewDate.displayName = displayName;

export default NewDate;
