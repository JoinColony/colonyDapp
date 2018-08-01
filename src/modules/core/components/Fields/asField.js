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
  connect?: boolean,
  id?: string,
  intl: IntlShape,
  form: {
    touched: Object,
    errors: Object,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean,
    ) => void,
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

const connectFormik = (FieldComponent: ComponentType<Object>) => ({
  connect = true,
  ...props
}: InProps) =>
  connect
    ? React.createElement(Field, {
        component: FieldComponent,
        ...props,
      })
    : React.createElement(FieldComponent, props);

const asField: HOC<*, OutProps> = compose(
  injectIntl,
  connectFormik,
  mapProps(
    ({
      id,
      intl: { formatMessage },
      field: { name: fieldName, value, onChange, onBlur } = {},
      form: { touched, errors, setFieldValue } = {},
      label,
      name,
      placeholder,
      title,
      ...props
    }: InProps) => {
      const htmlFieldName = fieldName || name;
      const $error =
        errors &&
        errors[htmlFieldName] &&
        formatIntl(errors[htmlFieldName], formatMessage);
      const $id = id || htmlFieldName;
      const $touched = touched && touched[htmlFieldName];
      const $title = formatIntl(title, formatMessage);
      const $label = formatIntl(label, formatMessage);
      const $placeholder = formatIntl(placeholder, formatMessage);
      // This is assigning an empty string to the field's value.
      // It might be problematic for some cases but for now I couldn't think of one
      const $value = value || '';
      return {
        'aria-label': label || $title,
        label: $label || $title,
        name: htmlFieldName || id,
        placeholder: $placeholder,
        title: $error || $title || $label || $placeholder,
        $id,
        $error,
        $value,
        $touched,
        onChange,
        onBlur,
        setValue: (val: any) => setFieldValue(htmlFieldName, val),
        ...props,
      };
    },
  ),
);

export default asField;
