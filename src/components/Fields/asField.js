/* @flow */

import type { HOC } from 'recompose';
import type { IntlShape, MessageDescriptor } from 'react-intl';
import type { ComponentType } from 'react';

import React from 'react';
import { Field } from 'formik';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

type FormatMessage = (
  messageDescriptor: MessageDescriptor,
  values?: Object,
) => string;

type CommonProps = {
  appearance?: Object,
  label?: MessageDescriptor | string,
  name: string,
  placeholder?: MessageDescriptor | string,
  title?: MessageDescriptor | string,
};

type InProps = CommonProps & {
  id?: string,
  intl: IntlShape,
  form: {
    touched: Object,
    errors: Object,
  },
  field: {
    name: string,
    value?: string,
    onChange: Function,
    onBlur: Function,
  },
};

type OutProps = CommonProps & {
  $error?: string,
  $value?: string,
  $touched?: boolean,
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
      id,
      intl: { formatMessage },
      field: { name, value, onChange, onBlur },
      form: { touched, errors },
      label,
      placeholder,
      title,
      ...props
    }: InProps) => ({
      'aria-label': label,
      label:
        formatIntl(label, formatMessage) || formatIntl(title, formatMessage),
      name,
      placeholder: formatIntl(placeholder, formatMessage),
      title:
        formatIntl(errors[name], formatMessage) ||
        formatIntl(title, formatMessage) ||
        formatIntl(label, formatMessage) ||
        formatIntl(placeholder, formatMessage),
      $id: id || name,
      $error: errors[name],
      $value: value,
      $touched: touched[name],
      onChange,
      onBlur,
      ...props,
    }),
  ),
);

// TODO: check whether composing in render functions is a good idea
const asField = (FieldComponent: ComponentType<Object>) => (props: Object) =>
  React.createElement(Field, { component: enhance(FieldComponent), ...props });

export default asField;
