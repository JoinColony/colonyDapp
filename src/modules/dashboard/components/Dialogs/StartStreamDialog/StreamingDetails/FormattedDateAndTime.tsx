import React from 'react';
import {
  defineMessages,
  FormattedDateParts,
  FormattedMessage,
} from 'react-intl';

import { isDateType } from './utils';

const MSG = defineMessages({
  date: {
    id: `dashboard.StartStreamDialog.StreamingDetails.FormattedDateAndTime.date`,
    defaultMessage: `{day} {month}, {year}, {hour}:{minute}{dayPeriod} {timeZoneName}`,
  },
});

const displayName = `dashboard.StartStreamDialog.StreamingDetails.FormattedDateAndTime`;

export interface DateType {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  dayPeriod: string;
  timeZoneName: string;
}

interface Props {
  date: number;
}

const FormattedDateAndTime = ({ date }: Props) => {
  return (
    <FormattedDateParts
      value={date}
      month="long"
      day="numeric"
      year="numeric"
      hour="2-digit"
      minute="2-digit"
      timeZoneName="short"
    >
      {(parts) => {
        const dateObj = parts.reduce((acc, curr) => {
          return { ...acc, [curr.type]: curr.value };
        }, {});

        if (!isDateType(dateObj)) {
          return null;
        }
        const {
          day,
          month,
          year,
          minute,
          hour,
          dayPeriod,
          timeZoneName,
        } = dateObj;

        return (
          <FormattedMessage
            {...MSG.date}
            values={{
              day,
              month,
              year,
              hour,
              minute,
              dayPeriod: dayPeriod.toLocaleLowerCase(),
              timeZoneName,
            }}
          />
        );
      }}
    </FormattedDateParts>
  );
};

FormattedDateAndTime.displayName = displayName;

export default FormattedDateAndTime;
