/* @flow */
import React from 'react';
import { FormattedRelative } from 'react-intl';

type Props = {
  /** Datetime to display */
  value: Date,
};

const displayName = 'Time';

const Time = ({ value, ...rest }: Props) => (
  <span {...rest}>
    <FormattedRelative value={value} />
  </span>
);

Time.displayName = displayName;

export default Time;
