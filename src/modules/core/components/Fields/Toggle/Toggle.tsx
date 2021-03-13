import React from 'react';
import { useField } from 'formik';

import InputLabel from '~core/Fields/InputLabel';

import styles from './Toggle.css';

const displayName = 'Toggle';

interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
}

const Toggle = ({ name, label, disabled }: Props) => {
  const [{ onChange, value }] = useField(name);

  return (
    <div className={styles.container}>
      {label && (
        <InputLabel label={label} appearance={{ colorSchema: 'grey' }} />
      )}
      <div>
        <input
          name={name}
          type="checkbox"
          disabled={disabled}
          aria-checked={value}
          aria-disabled={disabled}
          className={styles.delegate}
          onChange={onChange}
        />
        <span className={disabled ? styles.toggleDisabled : styles.toggle}>
          <span className={value ? styles.checked : styles.toggleSwitch} />
        </span>
      </div>
    </div>
  );
};

Toggle.displayName = displayName;

export default Toggle;
