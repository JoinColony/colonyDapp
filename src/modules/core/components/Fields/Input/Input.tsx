import React, { ReactNode, RefObject, useState } from 'react';
import cx from 'classnames';
import { CleaveOptions } from 'cleave.js/options';
import { MessageDescriptor, useIntl } from 'react-intl';
import { useField } from 'formik';
import { nanoid } from 'nanoid';

import { SimpleMessageValues } from '~types/index';

import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';
import InputComponent, { Props as InputComponentProps } from './InputComponent';

import styles from './Input.css';

export interface Appearance {
  theme?: 'fat' | 'underlined' | 'minimal' | 'dotted';
  align?: 'right';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'grey' | 'transparent';
  helpAlign?: 'right';
  size?: 'small' | 'medium';
  statusSchema?: 'info';
}

export interface Props extends Omit<InputComponentProps, 'placeholder'> {
  /** Appearance object */
  appearance?: Appearance;

  /** Should display the input with the label hidden */
  elementOnly?: boolean;

  /** Add extension of input to the right of it, i.e. for ENS name */
  extensionString?: string | MessageDescriptor;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Options for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)) */
  formattingOptions?: CleaveOptions;

  /** Help text */
  help?: string | MessageDescriptor;

  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;

  /** Html `id` for label & input */
  id?: string;

  /** Pass a ref to the `<input>` element */
  innerRef?: RefObject<any> | ((ref: HTMLElement | null) => void);

  /** Label text */
  label?: string | MessageDescriptor;

  /** Label text values for intl interpolation */
  labelValues?: SimpleMessageValues;

  /** Placeholder text */
  placeholder?: string | MessageDescriptor;

  /** Placeholder text values for intl interpolation */
  placeholderValues?: SimpleMessageValues;

  /** Status text */
  status?: string | MessageDescriptor;

  /** Status text values for intl interpolation */
  statusValues?: SimpleMessageValues;

  /** Set the input field to a disabled state */
  disabled?: boolean;

  /*
   * Force the input component into an error state.
   *
   * This is to circumvent a issue in Formik where the fieldErrors object
   * gets constantly overwritten, so you cannot actually do custom validaton,
   * while also having a validationSchema declared.
   *
   * Note that this is visual only, it doesn't actually hook into the Form's state,
   * this just "makes" the input field look like it has an error.
   * Any error states need to be maintained externally of this.
   *
   * See: https://github.com/formium/formik/issues/706
   */
  forcedFieldError?: MessageDescriptor | string;

  /** External on change hook */
  onChange?: (e: React.ChangeEvent<any>) => void;
  /** Testing */
  dataTest?: string;
}

const Input = ({
  appearance = {},
  disabled,
  elementOnly,
  extensionString,
  extra,
  formattingOptions,
  help,
  helpValues,
  innerRef,
  id: idProp,
  label,
  labelValues,
  name,
  placeholder: placeholderProp,
  placeholderValues,
  status,
  statusValues,
  forcedFieldError,
  maxLength,
  maxButtonParams,
  dataTest,
  onChange,
}: Props) => {
  const [id] = useState(idProp || nanoid());
  const { formatMessage } = useIntl();
  const [inputFieldProps, { error, touched }] = useField<string>(name);

  const placeholder =
    typeof placeholderProp === 'object'
      ? formatMessage(placeholderProp, placeholderValues)
      : placeholderProp;

  const inputProps: InputComponentProps = {
    ...inputFieldProps,
    appearance,
    'aria-invalid': (!!error || !!forcedFieldError) && touched,
    formattingOptions,
    id,
    innerRef,
    name,
    placeholder,
    disabled,
    maxLength,
    maxButtonParams,
    dataTest,
    onChange: (event) => {
      inputFieldProps.onChange(event);
      if (onChange) {
        onChange(event);
      }
    },
  };

  const extensionStringText: string | undefined =
    !extensionString || typeof extensionString === 'string'
      ? extensionString
      : formatMessage(extensionString);

  const containerClasses = cx(styles.container, {
    [styles.containerHorizontal]: appearance.direction === 'horizontal',
  });
  return (
    <div className={containerClasses}>
      {label && (
        <InputLabel
          appearance={appearance}
          inputId={id}
          label={label}
          labelValues={labelValues}
          help={help}
          helpValues={helpValues}
          extra={extra}
          screenReaderOnly={elementOnly}
        />
      )}
      <div className={styles.extensionContainer}>
        <InputComponent {...inputProps} />
        {extensionStringText && (
          <div className={styles.extension}>{extensionStringText}</div>
        )}
      </div>
      {!elementOnly && (
        <InputStatus
          appearance={appearance}
          status={status}
          statusValues={statusValues}
          error={error || forcedFieldError}
          touched={touched}
        />
      )}
    </div>
  );
};

Input.displayName = 'Input';

export default Input;
