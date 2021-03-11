import React from 'react';
import { getMainClasses } from '~utils/css';

import RadioButton, { RadioButtonTypes, Appearance } from '~core/RadioButton';

import styles from './RadioButtons.css';

interface Props {
  /** Appearance object */
  appearance?: Appearance;
  options: RadioButtonTypes[];
  /** Currently selected value */
  currentlyCheckedValue: string;
  /** HTML field name */
  name: string;
}

const displayName = 'RadioButtons';

const RadioButtons = ({
  options,
  currentlyCheckedValue,
  name,
  appearance = { direction: 'horizontal' },
}: Props) => {
  return (
    <div className={getMainClasses(appearance, styles)}>
      {options.map(({ value, label, ...rest }) => (
        <RadioButton
          checked={currentlyCheckedValue === value}
          name={name}
          value={value}
          label={label}
          {...rest}
        />
      ))}
    </div>
  );
};

RadioButtons.displayName = displayName;

export default RadioButtons;
