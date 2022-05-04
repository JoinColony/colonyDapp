import React from 'react';
import { getMainClasses } from '~utils/css';

import { CustomRadio, CustomRadioProps } from '~core/Fields/Radio';

import styles from './CustomRadioGroup.css';

export interface Appearance {
  direction?: 'horizontal' | 'vertical';
  gap?: 'medium';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;
  options: CustomRadioProps[];
  /** Currently selected value */
  currentlyCheckedValue: string;
  /** HTML field name */
  name: string;
  /** Disable the input */
  disabled?: boolean;
  /** Provides value for data-test used on cypress testing */
  dataTest?: string;
}

const displayName = 'CustomRadioGroup';

const CustomRadioGroup = ({
  options,
  currentlyCheckedValue,
  name,
  appearance = { direction: 'horizontal' },
  disabled,
  dataTest,
}: Props) => {
  return (
    <div className={getMainClasses(appearance, styles)}>
      {options.map(
        /*
         * We need to take out both `checked` and `name`, as to not be
         * overwritten when spreading the `rest` object
         */
        ({
          value,
          label,
          appearance: optionApperance,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          checked,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          name: optionName,
          dataTest: optionDataTest,
          ...rest
        }) => (
          <CustomRadio
            checked={currentlyCheckedValue === value}
            name={name}
            value={value}
            label={label}
            key={value}
            appearance={{ ...optionApperance, direction: appearance.direction }}
            disabled={disabled}
            dataTest={optionDataTest || dataTest}
            {...rest}
          />
        ),
      )}
    </div>
  );
};

CustomRadioGroup.displayName = displayName;

export default CustomRadioGroup;
