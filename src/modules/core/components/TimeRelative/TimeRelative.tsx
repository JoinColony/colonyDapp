import React, { HTMLAttributes } from 'react';
import { FormattedRelativeTime } from 'react-intl';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /** Time in seconds to update */
  updateInterval?: number;
  /** Datetime to calculate relative/difference from. */
  value: Date;
}

const nearestIntervalOf = (value: number, increment: number) =>
  Math.round(value / increment) * increment;

const displayName = 'TimeRelative';

const TimeRelative = ({
  value: valueProp,
  updateInterval = 15,
  ...rest
}: Props) => {
  const valueInSeconds = Math.floor(
    nearestIntervalOf(
      (new Date(valueProp).getTime() - new Date().getTime()) / 1000,
      updateInterval,
    ),
  );

  return (
    <span {...rest}>
      <FormattedRelativeTime
        numeric="auto"
        updateIntervalInSeconds={updateInterval}
        value={valueInSeconds}
      />
    </span>
  );
};

TimeRelative.displayName = displayName;

export default TimeRelative;
