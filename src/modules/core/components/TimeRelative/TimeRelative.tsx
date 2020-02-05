import React from 'react';
import { FormattedRelativeTime } from 'react-intl';

interface Props {
  /** Datetime to calculate relative/difference from. */
  value: Date;
}

const displayName = 'TimeRelative';

const TimeRelative = ({ value, ...rest }: Props) => (
  <span {...rest}>
    <FormattedRelativeTime
      numeric="auto"
      // eslint-disable-next-line react/style-prop-object
      style="short"
      unit="minute"
      value={(new Date(value).getTime() - new Date().getTime()) / 1000}
    />
  </span>
);

TimeRelative.displayName = displayName;

export default TimeRelative;
