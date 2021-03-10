import React from 'react';
import { MessageDescriptor } from 'react-intl';
import { useField } from 'formik';

import { getMainClasses } from '~utils/css';

import styles from './RadioButton.css';

export interface Appearance {
  theme?: 'primary' | 'danger';
  direction?: 'horizontal' | 'vertical';
}

export interface RadioButtonTypes {
  /** Appearance object */
  appearance?: Appearance;
  /** Disable the input */
  disabled?: boolean;
  /** HTML input value */
  value: string;
  /** Label text */
  label: string | MessageDescriptor;
  /** Button description */
  description?: string | MessageDescriptor;
  /** Button icon */
  icon?: string;
  /** If the input is checked */
  checked: boolean;
  /** Radio button name attribute */
  name: string;
}

const displayName = 'RadioButton';

const RadioButton = ({ disabled, value, label, checked, name, appearance = { theme: 'primary' }, description }: RadioButtonTypes) => {
  const [, { error }, { setValue }] = useField(name);
  return <label
    className={getMainClasses(appearance, styles, {
      isChecked: checked,
      isDisabled: !!disabled,
    })}
    onClick={() => setValue(value)}
  >
    <input
      aria-checked={checked}
      aria-disabled={disabled}
      aria-invalid={!!error}
      disabled={disabled}
      type="radio"
      value={value}
      name={name}
      className={styles.input}
    />
    <span className={styles.label}>{label}</span>
    <span className={styles.description}>{description}</span>
</label>;
};

RadioButton.displayName = displayName;

export default RadioButton;
