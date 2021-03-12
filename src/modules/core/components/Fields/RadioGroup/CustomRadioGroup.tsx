import React from 'react';
import { getMainClasses } from '~utils/css';

import { CustomRadio, CustomRadioProps } from '~core/Fields/Radio';

import styles from './CustomRadioGroup.css';

export interface Appearance {
  direction?: 'horizontal' | 'vertical';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;
  options: CustomRadioProps[];
  /** Currently selected value */
  currentlyCheckedValue: string;
  /** HTML field name */
  name: string;
}

const displayName = 'CustomRadioGroup';

const CustomRadioGroup = ({
  options,
  currentlyCheckedValue,
  name,
  appearance = { direction: 'horizontal' },
}: Props) => {
  return (
    <div className={getMainClasses(appearance, styles)}>
      {options.map(({ value, label, appearance: optionApperance, ...rest }) => (
        <CustomRadio
          checked={currentlyCheckedValue === value}
          name={name}
          value={value}
          label={label}
          key={value}
          appearance={{ ...optionApperance, direction: appearance.direction }}
          {...rest}
        />
      ))}
    </div>
  );
};

CustomRadioGroup.displayName = displayName;

export default CustomRadioGroup;
