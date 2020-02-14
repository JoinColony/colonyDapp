import React, { ReactNode } from 'react';
import cx from 'classnames';
import { CleaveOptions } from 'cleave.js/options';
import { MessageDescriptor } from 'react-intl';

import asField from '../asField';
import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';
import { FieldEnhancedProps } from '../types';
import InputComponent, { Props as InputComponentProps } from './InputComponent';

import styles from './Input.css';

interface Appearance {
  theme?: 'fat' | 'underlined' | 'minimal' | 'dotted';
  align?: 'right';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'grey' | 'transparent';
  helpAlign?: 'right';
  size?: 'small';
}

export interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Add extension of input to the right of it, i.e. for ENS name */
  extensionString?: string | MessageDescriptor;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Options for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)) */
  formattingOptions?: CleaveOptions;

  /** Pass a ref to the `<input>` element */
  innerRef?: (ref: HTMLElement | null) => void;
}

const Input = ({
  appearance = {},
  elementOnly,
  extensionString,
  extra,
  formattingOptions,
  formatIntl,
  help,
  innerRef,
  $id,
  label,
  name,
  onChange,
  status,
  $value,
  $error,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  connect,
  setValue,
  setError,
  isSubmitting,
  $touched,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...props
}: Props & FieldEnhancedProps<string, InputComponentProps>) => {
  const inputProps: InputComponentProps = {
    appearance,
    'aria-invalid': $error ? true : undefined,
    formattingOptions,
    id: $id,
    innerRef,
    name,
    onChange,
    value: undefined as (string | undefined),
    ...props,
  };

  // If there is an onChange handler, make it a controlled input
  if (onChange) {
    inputProps.value = $value;
  }

  const extensionStringText: string | undefined =
    !extensionString || typeof extensionString === 'string'
      ? extensionString
      : formatIntl(extensionString);

  if (elementOnly) {
    return <InputComponent {...inputProps} />;
  }
  const containerClasses = cx(styles.container, {
    [styles.containerHorizontal]: appearance.direction === 'horizontal',
  });
  return (
    <div className={containerClasses}>
      <InputLabel
        appearance={appearance}
        inputId={$id}
        label={label}
        help={help}
        extra={extra}
      />
      <div className={styles.extensionContainer}>
        <InputComponent {...inputProps} />
        {extensionStringText && (
          <div className={styles.extension}>{extensionStringText}</div>
        )}
      </div>
      <InputStatus appearance={appearance} status={status} error={$error} />
    </div>
  );
};

Input.displayName = 'Input';

export default asField<Props, string, InputComponentProps>({
  initialValue: '',
})(Input);
