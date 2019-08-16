import React from 'react';
import { FormattedRelative } from 'react-intl';

interface Props {
  /** Datetime to calculate relative/difference from. */
  value: Date;
}

const displayName = 'TimeRelative';

const TimeRelative = ({ value, ...rest }: Props) => (
  <span {...rest}>
    <FormattedRelative value={value} />
  </span>
);

TimeRelative.displayName = displayName;

export default TimeRelative;
