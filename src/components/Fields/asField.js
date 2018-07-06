/* @flow */

import type { HOC } from 'recompose';
import type { IntlShape, MessageDescriptor } from 'react-intl';

import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

type FormatMessage = (
  messageDescriptor: MessageDescriptor,
  values?: Object,
) => string;

type CommonProps = {
  label?: MessageDescriptor | string,
  name: string,
  placeholder?: MessageDescriptor | string,
  title?: MessageDescriptor | string,
};

type InProps = CommonProps & {
  intl: IntlShape,
  touched?: Object,
  values?: Object,
  errors?: Object,
};

type OutProps = CommonProps & {
  $error: string,
  $value: string,
  $touched: boolean,
};

const formatIntl = (
  prop?: MessageDescriptor | string,
  formatMessage: FormatMessage,
): string => {
  if (!prop) {
    return '';
  }
  if (typeof prop == 'string') {
    return prop;
  }
  return formatMessage(prop);
};

const enhance: HOC<*, OutProps> = compose(
  injectIntl,
  mapProps(
    ({
      label,
      name,
      placeholder,
      title,
      intl: { formatMessage },
      touched = {},
      values = {},
      errors = {},
      ...props
    }: InProps) => ({
      'aria-label': label,
      id: name,
      label:
        formatIntl(label, formatMessage) || formatIntl(title, formatMessage),
      name,
      placeholder: formatIntl(placeholder, formatMessage),
      title:
        formatIntl(errors[name], formatMessage) ||
        formatIntl(title, formatMessage) ||
        formatIntl(label, formatMessage) ||
        formatIntl(placeholder, formatMessage),
      $error: errors[name],
      $value: values[name],
      $touched: touched[name],
      ...props,
    }),
  ),
);

export default enhance;
