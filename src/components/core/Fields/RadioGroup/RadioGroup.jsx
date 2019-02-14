/* @flow */
import type { Node } from 'react';
import type { MessageDescriptor, MessageValues } from 'react-intl';

import React from 'react';

import type { Appearance as RadioAppearance } from '~components/core/Fields/Radio';

import { getMainClasses } from '~utils/css';
import Radio from '~components/core/Fields/Radio';

import styles from './RadioGroup.css';

export type RadioOption = {
  /** If the input is checked */
  checked?: boolean,
  /** Children to render in place of the default label */
  children?: Node,
  /** Disable the input */
  disabled?: boolean,
  /** Display the element without label */
  elementOnly?: boolean,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: MessageValues,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: MessageValues,
  /** Style object for the visible radio */
  radioStyle?: { [string]: string },
  /** Standard HTML input value */
  value: string,
};

type Props = {|
  /** Appearance object for the `Radio` fields */
  appearance?: RadioAppearance,
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean,
  /** Currently selected value (from the `Form` values) */
  currentlyCheckedValue: string,
  /** HTML field name */
  name: string,
  /** Radio options */
  options: Array<RadioOption>,
|};

const displayName = 'RadioGroup';

const RadioGroup = ({
  appearance,
  connect,
  currentlyCheckedValue,
  name,
  options,
}: Props) => (
  <div className={getMainClasses(appearance, styles)}>
    {options.map(({ children, value, ...rest }) => (
      <Radio
        appearance={appearance}
        checked={currentlyCheckedValue === value}
        connect={connect}
        key={value}
        name={name}
        value={value}
        {...rest}
      >
        {children}
      </Radio>
    ))}
  </div>
);

RadioGroup.displayName = displayName;

export default RadioGroup;
