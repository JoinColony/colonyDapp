/* @flow */

import type { HOC } from 'recompose';
import type { IntlShape, MessageDescriptor, MessageValues } from 'react-intl';
import type { ComponentType } from 'react';

import React from 'react';
import { Field, getIn } from 'formik';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

type FormatMessage = (
  messageDescriptor: MessageDescriptor,
  values?: MessageValues,
) => string;

type CommonProps = {
  appearance?: Object,
  label?: MessageDescriptor | string,
  name: string,
  placeholder?: MessageDescriptor | string,
  title?: MessageDescriptor | string,
};

type InProps = CommonProps & {
  elementOnly?: boolean,
  connect?: boolean,
  id?: string,
  intl: IntlShape,
  help?: string,
  helpValues?: MessageValues,
  labelValues?: MessageValues,
  statusValues?: MessageValues,
  status?: string | MessageDescriptor,
  form: {
    touched: Object,
    errors: Object,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean,
    ) => void,
    setFieldError: (field: string, value: string) => void,
  },
  field: {
    name: string,
    value?: any,
    onChange: Function,
    onBlur: Function,
    isSubmitting: boolean,
  },
};

type OutProps = CommonProps & {
  $error?: string,
  $value?: any,
  $touched?: boolean,
};

const formatIntl = (
  text?: MessageDescriptor | string,
  formatMessage: FormatMessage,
  textValues?: MessageValues,
): string => {
  if (!text) {
    return '';
  }
  if (typeof text == 'string') {
    return text;
  }
  return formatMessage(text, textValues);
};

const connectFormik = ({ alwaysConnected, validate }) => (
  FieldComponent: ComponentType<Object>,
) => ({ connect = true, ...props }: InProps) =>
  connect || alwaysConnected
    ? React.createElement(Field, {
        component: FieldComponent,
        validate,
        /*
         * @NOTE Expose the connect prop to use in more complex form wrapped components
         * Eg: ItemsList
         */
        connect,
        ...props,
      })
    : React.createElement(FieldComponent, { connect, ...props });

const asField = ({ alwaysConnected, validate, initialValue }: Object = {}) => {
  const enhance: HOC<*, OutProps> = compose(
    injectIntl,
    connectFormik({ alwaysConnected, validate }),
    mapProps(
      ({
        id,
        intl: { formatMessage },
        elementOnly,
        field: { name: fieldName, value, onChange, onBlur, isSubmitting } = {},
        form: { touched, errors, setFieldValue, setFieldError } = {},
        help,
        helpValues,
        label,
        labelValues,
        name,
        placeholder,
        status,
        statusValues,
        title,
        ...props
      }: InProps) => {
        const htmlFieldName = fieldName || name;
        const $touched = getIn(touched, htmlFieldName);
        const fieldError = getIn(errors, htmlFieldName);
        const $error = fieldError && formatIntl(fieldError, formatMessage);
        const $id = id || htmlFieldName;
        const $title = formatIntl(title, formatMessage);
        const $label = formatIntl(label, formatMessage, labelValues) || $title;
        const $help = formatIntl(help, formatMessage, helpValues);
        const $placeholder = formatIntl(placeholder, formatMessage);
        const $status = formatIntl(status, formatMessage, statusValues);
        return {
          elementOnly,
          'aria-invalid': !!$error,
          'aria-label': $label,
          'aria-labelledby': elementOnly ? null : `${$id}-label`,
          label: $label,
          help: $help,
          name: htmlFieldName || id,
          placeholder: $placeholder,
          status: $status,
          title: $error || $title || $label || $placeholder,
          $id,
          $error,
          $value: value || initialValue,
          $touched,
          onChange,
          onBlur,
          // We could consider creating a util/meta object for the following items:
          isSubmitting,
          formatIntl: (
            text?: string | MessageDescriptor,
            textValues?: MessageValues,
          ): string => formatIntl(text, formatMessage, textValues),
          setError: (errorMessage: string) =>
            setFieldError(htmlFieldName, errorMessage),
          setValue: (val: any) => setFieldValue(htmlFieldName, val),
          ...props,
        };
      },
    ),
  );
  return enhance;
};

export default asField;
