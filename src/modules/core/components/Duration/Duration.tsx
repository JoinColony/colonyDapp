import React, { HTMLAttributes } from 'react';
import { defineMessages, useIntl } from 'react-intl';

const MSG = defineMessages({
  timePhrase: {
    id: 'Duration.timePhrase',
    defaultMessage: `{days, plural, =0 {} other {{days}d}}
      {hours, plural, =0 {} other {{hours}h}}
      {minutes, plural, =0 {} other {{minutes}min}}`,
  },
  lessThanMinute: {
    id: 'Duration.lessThanMinute',
    defaultMessage: "'<'1m",
  },
});

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /** Number of seconds for the duration. */
  value: number;
}

const displayName = 'Duration';

const Duration = ({ value, ...rest }: Props) => {
  const { formatMessage } = useIntl();

  let seconds = value;
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  const timePhrase = formatMessage(MSG.timePhrase, {
    days,
    hours,
    minutes,
  });

  const lessThanMinute = formatMessage(MSG.lessThanMinute);

  const durationText = days || hours || minutes ? timePhrase : lessThanMinute;

  return <span {...rest}>{durationText}</span>;
};

Duration.displayName = displayName;

export default Duration;
