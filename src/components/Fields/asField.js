/* @flow */

import type { HOC } from 'recompose';
import type { MessageDescriptor } from 'react-intl';

import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

type FormatMessage = (MessageDescriptor, ?Object) => string;

type CommonProps = {
  label?: MessageDescriptor | string,
  name: string,
  placeholder?: MessageDescriptor | string,
  title?: MessageDescriptor | string,
};

type InProps = CommonProps & {
  formatMessage: FormatMessage,
  touched?: Object,
  values?: Object,
  errors?: Object,
};

type OutProps = CommonProps & {
  $error: string,
  $value: string,
  $isTouched: boolean,
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
      formatMessage,
      touched = {},
      values = {},
      errors = {},
      ...props
    }: InProps) => ({
      label:
        formatIntl(label, formatMessage) || formatIntl(title, formatMessage),
      placeholder: formatIntl(placeholder, formatMessage),
      title:
        formatIntl(title, formatMessage) ||
        formatIntl(label, formatMessage) ||
        formatIntl(placeholder, formatMessage),
      $error: errors[name],
      $value: values[name],
      $isTouched: touched[name],
      ...props,
    }),
  ),
);

export default enhance;
