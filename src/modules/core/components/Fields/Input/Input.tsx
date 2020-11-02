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
  label: string | MessageDescriptor;

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
}

const Input = ({
  appearance = {},
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
}: Props) => {
  const [id] = useState(idProp || nanoid());
  const { formatMessage } = useIntl();
  const [inputFieldProps, { error }] = useField<string>(name);

  const placeholder =
    typeof placeholderProp === 'object'
      ? formatMessage(placeholderProp, placeholderValues)
      : placeholderProp;

  const inputProps: InputComponentProps = {
    appearance,
    'aria-invalid': !!error,
    formattingOptions,
    id,
    innerRef,
    name,
    placeholder,
    ...inputFieldProps,
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
          error={error}
        />
      )}
    </div>
  );
};

Input.displayName = 'Input';

export default Input;
