/* @flow */

import React, { Component } from 'react';
import Cleave from 'cleave.js/react';

import { getMainClasses } from '~utils/css';

import styles from './InputComponent.css';

import type { CleaveOptions } from './types';

export type Appearance = {
  theme?: 'fat' | 'underlined',
  align?: 'right',
  width?: 'full',
  colorSchema?: 'dark' | 'transparent',
};

type CleaveHTMLInputElement = HTMLInputElement & { rawValue: string };

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Options for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)) */
  formattingOptions?: CleaveOptions,
  /** Input field name (form variable) */
  name: string,
  /** Pass a ref to the `<input>` element */
  innerRef?: (ref: ?HTMLInputElement) => void,
  /** @ignore Standard input field property */
  onChange?: (
    | SyntheticInputEvent<HTMLInputElement>
    | SyntheticInputEvent<CleaveHTMLInputElement>,
  ) => void,
};

class InputComponent extends Component<Props> {
  static displayName = 'InputComponent';

  handleChange = (evt: SyntheticInputEvent<CleaveHTMLInputElement>): void => {
    const {
      props: { onChange },
    } = this;
    // We are reassigning the value here as cleave just adds a `rawValue` prop
    // eslint-disable-next-line no-param-reassign
    evt.currentTarget.value = evt.currentTarget.rawValue;
    if (onChange) onChange(evt);
  };

  render() {
    const { appearance, formattingOptions, innerRef, ...props } = this.props;
    if (formattingOptions) {
      return (
        <Cleave
          {...props}
          className={getMainClasses(appearance, styles)}
          htmlRef={innerRef}
          options={formattingOptions}
          onChange={this.handleChange}
        />
      );
    }
    return (
      <input
        className={getMainClasses(appearance, styles)}
        ref={innerRef}
        {...props}
      />
    );
  }
}

export default InputComponent;
