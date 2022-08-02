import React, { HTMLAttributes } from 'react';
import { FormattedRelativeTime } from 'react-intl';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /** Time in seconds to update */
  updateInterval?: number;
  /** Datetime to calculate relative/difference from. */
  value: Date;
  formatting?: 'short' | 'long' | 'narrow';
}

const nearestIntervalOf = (value: number, increment: number) =>
  Math.round(value / increment) * increment;

const displayName = 'TimeRelative';

const TimeRelativeShort = ({
  value: valueProp,
  updateInterval = 15,
  formatting = 'long',
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
        // eslint-disable-next-line react/style-prop-object
        style={formatting}
      >
        {(formattedDate: string) => {
          const dateArr = formattedDate.split(/([0-9]+)/);
          const [preposition, ...time] = dateArr;
          const remainingTime = time.join(' ');

          return (
            <>
              {preposition}{' '}
              <span style={{ color: 'rgb(64,71,80)' }}>{remainingTime}</span>
            </>
          );
        }}
      </FormattedRelativeTime>
    </span>
  );
};

TimeRelativeShort.displayName = displayName;

export default TimeRelativeShort;
