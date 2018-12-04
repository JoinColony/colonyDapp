/* @flow */
import type { IntlShape } from 'react-intl';

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

const MSG = defineMessages({
  timePhrase: {
    id: 'Duration.timePhrase',
    defaultMessage: `{days, plural, =0 {} other {{days}d}}
      {hours, plural, =0 {} other {{hours}h}}
      {minutes, plural, =0 {} other {{minutes}min}}`,
  },
});

type Props = {
  /** @ignore injected by `injectIntl` */
  intl: IntlShape,
  /** Number of seconds for the duration. */
  value: number,
};

const displayName = 'Duration';

const Duration = ({ intl: { formatMessage }, value, ...rest }: Props) => {
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

  return <span {...rest}>{timePhrase}</span>;
};

Duration.displayName = displayName;

export default injectIntl(Duration);
