/* @flow */
import React from 'react';

import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import { getMainClasses } from '~utils/css';
import asField from '../asField';

import styles from './RadioInput.css';

type Appearance = {
  direction?: 'horizontal' | 'vertical',
  theme?: 'fakeCheckbox',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** If the input is checked initially */
  checked: boolean,
  /** Children to render */
  children?: Node,
  /** If the input is disabled initially */
  disabled?: boolean,
  /** Should display the element without label */
  elementOnly?: boolean,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** Input field name (form variable) */
  name: string,
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
  /** @ignore Standard input field property */
  onChange: Function,
};

const displayName = 'RadioInput';

const RadioInput = ({
  appearance,
  checked,
  children,
  disabled,
  elementOnly,
  $error,
  help,
  helpValues,
  $id,
  label,
  labelValues,
  formatIntl,
  name,
  $value,
  $touched,
  setError,
  setValue,
  ...props
}: Props) => (
  <label
    className={getMainClasses(appearance, styles)}
    aria-invalid={!!$error}
    aria-disabled={disabled}
    aria-checked={checked}
    htmlFor={elementOnly ? $id : null}
  >
    <input
      className={styles.delegate}
      value={$value}
      name={name}
      type="radio"
      {...props}
    />
    <span className={styles.radio}>
      {appearance.theme === 'fakeCheckbox' && (
        <span className={styles.checkmark} />
      )}
    </span>
    {!elementOnly && !!label ? (
      <InputLabel
        appearance={appearance}
        inputId={$id}
        label={label}
        error={$error}
        help={help}
      />
    ) : (
      label || children
    )}
  </label>
);

RadioInput.displayName = displayName;

RadioInput.defaultProps = {
  appearance: {
    direction: 'vertical',
  },
  disabled: false,
  elementOnly: false,
};

export default asField()(RadioInput);
