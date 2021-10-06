import React from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';

const MSG = defineMessage({
  days: {
    id: 'TimerValue.days',
    defaultMessage: ' {days}d',
  },
  hours: {
    id: 'TimerValue.hours',
    defaultMessage: ' {hours}h',
  },
  minutes: {
    id: 'TimerValue.minutes',
    defaultMessage: ' {minutes}m',
  },
  seconds: {
    id: 'TimerValue.seconds',
    defaultMessage: ' {seconds}s',
  },
});

interface Props {
  splitTime: any;
}

const displayName = 'TimerValue';

const TimerValue = ({ splitTime }: Props) => {
  if (splitTime === undefined) {
    return null;
  }

  return (
    <>
      {splitTime.days > 0 && (
        <FormattedMessage {...MSG.days} values={{ days: splitTime.days }} />
      )}
      {(splitTime.days > 0 || splitTime.hours > 0) && (
        <FormattedMessage {...MSG.hours} values={{ hours: splitTime.hours }} />
      )}
      {(splitTime.days > 0 || splitTime.hours > 0 || splitTime.minutes) > 0 && (
        <FormattedMessage
          {...MSG.minutes}
          values={{ minutes: splitTime.minutes }}
        />
      )}
      <FormattedMessage
        {...MSG.seconds}
        values={{ seconds: splitTime.seconds }}
      />
    </>
  );
};

TimerValue.displayName = displayName;

export default TimerValue;
