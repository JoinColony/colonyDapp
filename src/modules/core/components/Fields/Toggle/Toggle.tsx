import React, { useCallback } from 'react';
import { useField } from 'formik';
import { PopperOptions } from 'react-popper-tooltip';
import { MessageDescriptor } from 'react-intl';

import InputLabel from '~core/Fields/InputLabel';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './Toggle.css';

const displayName = 'Toggle';

interface Appearance {
  theme?: 'primary' | 'danger';
}
interface Props {
  appearance?: Appearance;
  name: string;
  label?: string | MessageDescriptor;
  labelValues?: SimpleMessageValues;
  disabled?: boolean;
  tooltipText?: string | MessageDescriptor;
  tooltipTextValues?: SimpleMessageValues;
  elementOnly?: boolean;
  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  tooltipPopperProps?: PopperOptions;
  onChange?: (value: boolean) => any;
}

const Toggle = ({
  appearance,
  name,
  label,
  labelValues,
  disabled = false,
  elementOnly = false,
  tooltipTextValues,
  tooltipText,
  tooltipPopperProps = {
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-3, 10],
        },
      },
    ],
  },
  onChange: onChangeCallback,
}: Props) => {
  const [{ onChange, value }] = useField(name);

  const mainClasses = getMainClasses(appearance, styles);

  const handleOnChange = useCallback(
    (event) => {
      onChange(event);
      if (onChangeCallback) {
        onChangeCallback(value);
      }
    },
    [onChange, onChangeCallback, value],
  );

  return (
    <div className={styles.container}>
      {!elementOnly && label && (
        <InputLabel
          label={label}
          labelValues={labelValues}
          appearance={{ colorSchema: 'grey' }}
        />
      )}
      <div>
        <input
          name={name}
          type="checkbox"
          disabled={disabled}
          checked={value}
          aria-checked={value}
          aria-disabled={disabled}
          className={styles.delegate}
          onChange={handleOnChange}
        />
        <span className={disabled ? styles.toggleDisabled : styles.toggle}>
          <span className={value ? mainClasses : styles.toggleSwitch} />
        </span>
      </div>
      {tooltipText && (
        <QuestionMarkTooltip
          className={styles.icon}
          tooltipText={tooltipText}
          tooltipPopperProps={tooltipPopperProps}
          tooltipTextValues={tooltipTextValues}
        />
      )}
    </div>
  );
};

Toggle.displayName = displayName;

export default Toggle;
