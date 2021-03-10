import React from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import { useField } from 'formik';

import { getMainClasses } from '~utils/css';
import Icon from '~core/Icon';
import { SimpleMessageValues } from '~types/index';

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
  /** Description text values for intl interpolation */
  descriptionValues?: SimpleMessageValues;
  /** Button icon */
  icon?: string;
  /** If the input is checked */
  checked: boolean;
  /** Radio button name attribute */
  name: string;
}

const displayName = 'RadioButton';

const RadioButton = ({
  disabled,
  value,
  label,
  checked,
  name,
  appearance = { theme: 'primary' },
  description,
  descriptionValues,
  icon,
}: RadioButtonTypes) => {
  const [, { error }, { setValue }] = useField(name);
  const { formatMessage } = useIntl();

  const labelText =
    typeof label === 'object' ? formatMessage(label) : label;
  const descriptionText =
    typeof description === 'object'
      ? formatMessage(description, descriptionValues)
      : description;
  return (
    <label
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
      {icon && (
        <div className={styles.icon}>
          <Icon appearance={{ size: 'medium' }} name={icon} title={icon} />
        </div>
      )}
      {labelText && (
        <span className={styles.label}>{labelText}</span>
      )}
      {descriptionText && (
        <span className={styles.description}>{descriptionText}</span>
      )}
    </label>
  );
};

RadioButton.displayName = displayName;

export default RadioButton;
