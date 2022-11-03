import React, {
  ReactNode,
  SyntheticEvent,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ComponentType,
} from 'react';
import { MessageDescriptor } from 'react-intl';
import { nanoid } from 'nanoid';

import { PopperOptions } from 'react-popper-tooltip';

import InputLabel from '~core/Fields/InputLabel';
import { Tooltip } from '~core/Popover';
import asFieldArray, {
  AsFieldArrayEnhancedProps,
} from '~core/Fields/asFieldArray';
import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';
import { isEqual, findIndex } from '~utils/lodash';

import styles from './Checkbox.css';

interface Appearance {
  theme: 'dark' | 'pink';
  direction: 'vertical' | 'horizontal';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;
  /** Children to render in place of the default label */
  children?: ReactNode;
  /** Additional className for customizing styles */
  className?: string;
  /** Disable the input */
  disabled?: boolean;
  /** Display the element without label */
  elementOnly?: boolean;
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;
  /** Values for help text (react-intl interpolation) */
  helpValues?: SimpleMessageValues;
  /** Label text */
  label?: string | MessageDescriptor;
  /** Values for label text (react-intl interpolation) */
  labelValues?: SimpleMessageValues;
  /** Input field name (form variable) */
  name: string;
  /** Standard input field property */
  onChange?: Function;
  /** Just to check what is a default value of checkbox */
  getDefaultValue?: Function;
  /** Value to be added/removed from fieldArray */
  value: any;
  /** Tooltip text visibility */
  showTooltipText?: boolean;
  /**  Text for the checkbox tooltip */
  tooltipText?: string;
  /** Options to pass to the underlying PopperJS element. See here for more: https://popper.js.org/docs/v2/constructors/#options. */
  tooltipPopperOptions?: PopperOptions;
  dataTest?: string;
}

const displayName = 'Checkbox';

const Checkbox = ({
  appearance,
  children,
  className,
  disabled = false,
  elementOnly = false,
  help,
  helpValues,
  label,
  labelValues,
  name,
  onChange,
  value,
  tooltipText,
  tooltipPopperOptions,
  dataTest,
  getDefaultValue,
  showTooltipText,
  /* Injected by asFieldArray */
  form: { values },
  push,
  remove,
}: AsFieldArrayEnhancedProps<Props>) => {
  const [inputId] = useState<string>(nanoid());
  const equalsValue = useCallback((val: any) => isEqual(val, value), [value]);

  const handleOnChange = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      const idx = findIndex(values[name], equalsValue);
      if (idx >= 0) {
        remove(idx);
      } else {
        push(value);
      }
      if (onChange) {
        onChange({ ...e, isChecked: !(idx >= 0) });
      }
    },
    [name, onChange, push, remove, value, values, equalsValue],
  );

  const isChecked = findIndex(values[name], equalsValue) >= 0;
  const mainClasses = getMainClasses(appearance, styles, {
    isChecked,
    disabled,
  });
  const classNames = className ? `${mainClasses} ${className}` : mainClasses;

  const checkboxInputContent = useMemo(
    () => (
      <>
        <input
          id={inputId}
          className={styles.delegate}
          name={name}
          type="checkbox"
          disabled={disabled}
          onChange={handleOnChange}
          aria-disabled={disabled}
          aria-checked={isChecked}
          data-test={dataTest}
        />
        <span className={styles.checkbox}>
          <span className={styles.checkmark} />
        </span>
      </>
    ),
    [disabled, handleOnChange, inputId, isChecked, name, dataTest],
  );

  useEffect(() => {
    if (getDefaultValue) {
      getDefaultValue(isChecked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <label className={classNames} htmlFor={elementOnly ? inputId : undefined}>
      {(disabled && tooltipText) || (showTooltipText && tooltipText) ? (
        <Tooltip
          content={tooltipText}
          placement="bottom"
          popperOptions={tooltipPopperOptions}
        >
          <div>{checkboxInputContent}</div>
        </Tooltip>
      ) : (
        checkboxInputContent
      )}
      {!elementOnly && !!label ? (
        <InputLabel
          inputId={inputId}
          label={label}
          labelValues={labelValues}
          help={help}
          helpValues={helpValues}
          appearance={{ direction: 'horizontal' }}
        />
      ) : (
        label || children
      )}
    </label>
  );
};

Checkbox.displayName = displayName;

Checkbox.defaultProps = {
  appearance: {
    direction: 'vertical',
  },
  checked: false,
  disabled: false,
  elementOnly: false,
  showTooltipText: false,
};

export default asFieldArray()(Checkbox) as ComponentType<Props>;
