import { DateType } from './FormattedDateAndTime';

export const isDateType = (obj: any): obj is DateType => {
  return (
    'day' in obj &&
    'month' in obj &&
    'year' in obj &&
    'dayPeriod' in obj &&
    'hour' in obj &&
    'minute' in obj &&
    'timeZoneName' in obj
  );
};
