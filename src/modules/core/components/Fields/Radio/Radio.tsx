import React, { ReactNode, useRef } from 'react';
import { nanoid } from 'nanoid';
import { useField } from 'formik';
import { MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import InputLabel from '../InputLabel';

import styles from './Radio.css';

export interface Appearance {
  direction?: 'horizontal' | 'vertical';
  theme?: 'buttonGroup' | 'fakeCheckbox' | 'colorPicker';
}

export interface Props {
  /** Appearance object */
  appearance?: Appearance;
  /** If the input is checked */
  checked: boolean;
  /** Children to render in place of the default label */
  children?: ReactNode;
  /** Disable the input */
  disabled?: boolean;
  /** Should render label with input */
  elementOnly?: boolean;
  /** Help text */
  help?: string | MessageDescriptor;
  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;
  /** Label text */
  label?: string | MessageDescriptor;
  /** Label text values for intl interpolation */
  labelValues?: SimpleMessageValues;
  /** Input `name` attribute */
  name: string;
  /** Style object for the visible radio */
  radioStyle?: { [k: string]: string };
  /** Html input `id` attribute */
  inputId?: string;
  /** Value of radio input */
  value: string;
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
  help,
  helpValues,
  inputId: inputIdProp,
  label,
  labelValues,
  name,
  radioStyle,
  value: valueProp,
}: Props) => {
  const [, { error }, { setValue }] = useField(name);
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
          aria-checked={checked}
          aria-disabled={disabled}
          aria-invalid={!!error}
          className={styles.delegate}
          disabled={disabled}
          id={inputId}
          onClick={() => setValue(valueProp)}
          type="radio"
          value={valueProp}
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
              labelValues={labelValues}
              help={help}
              helpValues={helpValues}
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

export default Radio;
