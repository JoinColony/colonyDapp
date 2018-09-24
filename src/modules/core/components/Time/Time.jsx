/* @flow */
import type { IntlShape } from 'react-intl';

import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import { formattedTimeNumeric } from '~utils/date';

const formatDate = {
  fromnow: (intl, value, now) => intl.formatRelative(value, { now }),
  fromnowNumericHours: (_, value, now) =>
    formattedTimeNumeric(value, now, {
      showHours: true,
      showMinutes: false,
      showSeconds: false,
      showLeadingZeros: true,
      separator: ':',
    }),
  fromnowNumericMinutes: (_, value, now) =>
    formattedTimeNumeric(value, now, {
      showHours: true,
      showMinutes: true,
      showSeconds: false,
      showLeadingZeros: true,
      separator: ':',
    }),
  fromnowNumericSeconds: (_, value, now) =>
    formattedTimeNumeric(value, now, {
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showLeadingZeros: true,
      separator: ':',
    }),
  date: (intl, value) =>
    intl.formatDate(value, {
      day: 'numeric',
      month: 'short',
    }),
  dateLong: (intl, value) =>
    intl.formatDate(value, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  time: (intl, value) =>
    intl.formatTime(value, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
  datetime: (intl, value) =>
    intl.formatDate(value, {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
  datetimeLong: (intl, value) =>
    intl.formatDate(value, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
  day: (intl, value) => intl.formatDate(value, { day: 'numeric' }),
  month: (intl, value) => intl.formatDate(value, { month: 'short' }),
};

type Props = {
  /** Time format */
  format?: string,
  /** Datetime to display */
  value: Date,
  /** @ignore injected by `injectIntl` */
  intl: IntlShape,
};

class Time extends Component<Props> {
  now: Date;

  static displayName = 'Time';

  componentWillMount() {
    // We have to do it like this as we want the reference time to be the time the component was mounted
    this.now = new Date();
  }

  render() {
    const { format = 'fromnow', value, intl, ...props } = this.props;
    const formatFn = formatDate[format];
    const formatted = (formatFn || formatDate.fromnow)(intl, value, this.now);
    // Only show the tooltip on relative time formats
    const title =
      format === 'fromnow' ? formatDate.datetimeLong(intl, value) : null;

    return (
      <span {...props} title={title}>
        {formatted}
      </span>
    );
  }
}

export default injectIntl(Time);
