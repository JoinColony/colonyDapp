import { Field, getIn, FieldAttributes } from 'formik';
import {
  createElement,
  ComponentType,
  HTMLAttributes,
  ReactElement,
} from 'react';
import {
  injectIntl,
  MessageDescriptor,
  WrappedComponentProps,
} from 'react-intl';
import { compose, mapProps } from 'recompose';

import { SimpleMessageValues } from '~types/index';

import {
  AsFieldConfig,
  AsFieldEnhancedProps,
  FormatMessage,
  ExtraFieldProps,
} from './types';

const formatIntl = (
  text: MessageDescriptor | string | undefined,
  formatMessage: FormatMessage,
  textValues?: SimpleMessageValues,
): string | undefined => {
  if (typeof text === 'undefined') {
    return undefined;
  }
  if (!text) {
    return '';
  }
  if (typeof text === 'string') {
    return text;
  }
  return formatMessage(text, textValues);
};

const connectFormik = <P>({ alwaysConnected, validate }) => (
  FieldComponent: ComponentType<any>,
) => ({
  connect = true,
  ...props
}: ExtraFieldProps & P): ReactElement<
  FieldAttributes<any> & ExtraFieldProps & P
> =>
  connect || alwaysConnected
    ? createElement<FieldAttributes<any>>(Field, {
        component: FieldComponent,
        validate,

        /*
         * Expose the connect prop to use in more complex form wrapped components
         * Eg: ItemsList
         */
        connect,
        ...props,
      })
    : createElement<any>(FieldComponent, { connect, ...props });

type InnerProps<P, T> = AsFieldEnhancedProps<T> & P;
// prefer `AsFieldEnhancedProps` over `T`
type OuterProps<P, T> = Omit<T, keyof AsFieldEnhancedProps<T>> &
  Omit<ExtraFieldProps, keyof P> &
  P;

type PropsMapperOuterProps<P> = ExtraFieldProps & WrappedComponentProps & P;

const asField = <
  P,
  // `T` allows passing props along to element of type `T`
  // @todo default `T` to never type? Since most components won't pass props along to element of type `T`
  T extends HTMLAttributes<HTMLElement> | never = HTMLAttributes<HTMLElement>
>({ alwaysConnected, validate, initialValue }: AsFieldConfig = {}) =>
  compose<InnerProps<P, T>, OuterProps<P, T>>(
    injectIntl,
    connectFormik<P>({ alwaysConnected, validate }),
    mapProps<AsFieldEnhancedProps<T>, PropsMapperOuterProps<P>>(
      ({
        connect = true,
        id,
        intl: { formatMessage },
        elementOnly,
        help,
        helpValues,
        label,
        labelValues,
        name = '',
        placeholder,
        status,
        statusValues,
        title,
        field: { name: fieldName, value, onChange, onBlur } = {},
        form: {
          touched,
          errors,
          setFieldValue,
          setFieldError,
          isSubmitting,
        } = {},
        ...props
      }: ExtraFieldProps & WrappedComponentProps & P): AsFieldEnhancedProps<
        T
      > => {
        const htmlFieldName = fieldName || name;
        const $touched = getIn(touched, htmlFieldName);
        const fieldError = getIn(errors, htmlFieldName);
        const $error = formatIntl(fieldError, formatMessage);
        const $id = id || htmlFieldName;
        const $title = formatIntl(title, formatMessage);
        const $label =
          formatIntl(label, formatMessage, labelValues) ||
          $title ||
          htmlFieldName;
        const $help = formatIntl(help, formatMessage, helpValues);
        const $placeholder = formatIntl(placeholder, formatMessage);
        const $status = formatIntl(status, formatMessage, statusValues);
        return {
          connect,
          elementOnly,
          'aria-invalid': !!$error,
          'aria-label': $label || undefined,
          'aria-labelledby': elementOnly ? undefined : `${$id}-label`,
          label: $label,
          help: $help,
          name: htmlFieldName,
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
          formatIntl: (text, textValues) =>
            formatIntl(text, formatMessage, textValues),
          setError:
            typeof setFieldError === 'function'
              ? errorMessage =>
                  setFieldError(
                    htmlFieldName,
                    formatIntl(errorMessage, formatMessage) || '',
                  )
              : undefined,
          setValue:
            typeof setFieldValue === 'function'
              ? (val: any) => setFieldValue(htmlFieldName, val)
              : undefined,
          ...props,
        };
      },
    ),
  );

export default asField;
