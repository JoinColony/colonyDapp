import React, { ReactNode, useRef } from 'react';
import nanoid from 'nanoid';

import { getMainClasses } from '~utils/css';

import InputLabel from '../InputLabel';
import asField from '../asField';
import { AsFieldEnhancedProps } from '../types';

import styles from './Radio.css';

export interface Appearance {
  direction?: 'horizontal' | 'vertical';
  theme?: 'buttonGroup' | 'fakeCheckbox' | 'colorPicker';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;
  /** If the input is checked */
  checked: boolean;
  /** Children to render in place of the default label */
  children?: ReactNode;
  /** Disable the input */
  disabled?: boolean;
  /** Style object for the visible radio */
  radioStyle?: { [k: string]: string };
  inputId?: string;
  value?: any;
}

const displayName = 'Radio';

const Radio = ({
  appearance = {
    direction: 'vertical',
  },
  checked,
  children,
  disabled = false,
  elementOnly = false,
  $error,
  help,
  inputId: inputIdProp,
  label,
  name,
  $value,
  radioStyle,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  connect,
  $id,
  formatIntl,
  $touched,
  setError,
  setValue,
  isSubmitting,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...props
}: Props & AsFieldEnhancedProps) => {
  const { current: inputId } = useRef<string>(inputIdProp || nanoid());
  return (
    <label
      className={getMainClasses(appearance, styles, {
        customChildren: !!children,
        isChecked: checked,
        isDisabled: !!disabled,
      })}
      htmlFor={elementOnly ? inputId : undefined}
    >
      <>
        <input
          className={styles.delegate}
          value={$value}
          name={name}
          type="radio"
          id={inputId}
          disabled={disabled}
          aria-checked={checked}
          aria-disabled={disabled}
          aria-invalid={!!$error}
          {...props}
        />
        <span className={styles.radio} style={radioStyle}>
          {!!appearance && appearance.theme === 'fakeCheckbox' && (
            <span className={styles.checkmark} />
          )}
        </span>
        {!elementOnly && !!label ? (
          <span className={styles.labelContainer}>
            <InputLabel
              appearance={{ direction: 'horizontal' }}
              label={label}
              help={help}
              inputId={inputId}
            />
          </span>
        ) : (
          label || children
        )}
      </>
    </label>
  );
};

Radio.displayName = displayName;

export default asField<Props>()(Radio);
