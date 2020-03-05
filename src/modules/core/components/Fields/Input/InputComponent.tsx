import React, { useCallback, InputHTMLAttributes, useMemo } from 'react';
import Cleave from 'cleave.js/react';
import { CleaveOptions } from 'cleave.js/options';
import { ChangeEvent } from 'cleave.js/react/props';

import { getMainClasses } from '~utils/css';

import styles from './InputComponent.css';

export type Appearance = {
  theme?: 'fat' | 'underlined' | 'minimal' | 'dotted';
  align?: 'right';
  colorSchema?: 'dark' | 'grey' | 'transparent';
  size?: 'small';
};

type CleaveHTMLInputElement = HTMLInputElement & { rawValue: string };

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'form'> {
  /** Appearance object */
  appearance?: Appearance;

  /** Options for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)) */
  formattingOptions?: CleaveOptions;

  /** Input field name (form variable) */
  name: string;

  /** Pass a ref to the `<input>` element */
  innerRef?: (ref: HTMLInputElement | null) => void;
}

const displayName = 'InputComponent';

const InputComponent = ({
  appearance,
  formattingOptions,
  innerRef,
  onChange,
  placeholder,
  ...props
}: Props) => {
  const handleCleaveChange = useCallback(
    (evt: ChangeEvent<CleaveHTMLInputElement>): void => {
      // We are reassigning the value here as cleave just adds a `rawValue` prop
      // eslint-disable-next-line no-param-reassign
      evt.currentTarget.value = evt.currentTarget.rawValue;
      if (onChange) onChange(evt);
    },
    [onChange],
  );
  /*
   * @NOTE Coerce cleave into handling dynamically changing options
   * See here for why this isn't yet supported "officially":
   * https://github.com/nosir/cleave.js/issues/352#issuecomment-447640572
   */
  const dynamicCleaveOptionKey = useMemo(
    () => JSON.stringify(formattingOptions),
    [formattingOptions],
  );

  if (formattingOptions) {
    return (
      <Cleave
        {...props}
        key={dynamicCleaveOptionKey}
        className={getMainClasses(appearance, styles)}
        htmlRef={innerRef}
        options={formattingOptions}
        onChange={handleCleaveChange}
        placeholder={placeholder}
      />
    );
  }
  return (
    <input
      className={getMainClasses(appearance, styles)}
      onChange={onChange}
      placeholder={placeholder}
      ref={innerRef}
      {...props}
    />
  );
};

InputComponent.displayName = displayName;

export default InputComponent;
