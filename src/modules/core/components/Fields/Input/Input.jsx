/* @flow */

import type { MessageDescriptor } from 'react-intl';
import React from 'react';
import cx from 'classnames';

import styles from './Input.css';

import asField from '../asField';
import InputLabel from '../InputLabel';

import type { CleaveOptions } from './types';

import InputComponent from './InputComponent.jsx';

type Appearance = {
  theme?: 'fat' | 'underlined',
  align?: 'right',
  direction?: 'horizontal',
  width?: 'full',
  colorSchema?: 'dark' | 'transparent',
};

type Props = {
  /** Appearance object */
  appearance: Appearance,
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean,
  /** Just render the `<input>` element without label */
  elementOnly?: boolean,
  /** Options for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)) */
  formattingOptions?: CleaveOptions,
  /** Input field name (form variable) */
  name: string,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Pass a ref to the `<input>` element */
  innerRef?: (ref: ?HTMLElement) => void,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** Placeholder for input */
  placeholder?: string,
  /** @ignore Will be injected by `asField` */
  $id: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $value?: string,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: { [string]: string },
  ) => string,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
  /** @ignore Will be injected by `asField` */
  setError: (val: any) => void,
};

const Input = ({
  appearance,
  elementOnly,
  formattingOptions,
  formatIntl,
  help,
  $id,
  innerRef,
  label,
  name,
  $value,
  $error,
  $touched,
  setValue,
  setError,
  ...props
}: Props) => {
  const inputProps = {
    appearance,
    formattingOptions,
    id: $id,
    innerRef,
    name,
    'aria-invalid': $error ? true : null,
    value: $value,
    ...props,
  };

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
        error={$error}
        help={help}
      />
      <InputComponent {...inputProps} />
      {appearance.direction === 'horizontal' && $error ? (
        <span className={styles.error}>{$error}</span>
      ) : null}
    </div>
  );
};

Input.displayName = 'Input';

Input.defaultProps = {
  appearance: {},
};

export default asField()(Input);
