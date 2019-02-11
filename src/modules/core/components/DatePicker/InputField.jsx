/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';

import type { InputComponentAppearance } from '../Fields/Input';

import Input from '../Fields/Input';

import { ESC, TAB } from './keyTypes';

// Left intentionally unsealed (passing props)
type Props = {
  appearance?: InputComponentAppearance,
  close: (data?: any, modifiers?: { cancelled?: boolean }) => void,
  id: string,
  isOpen: boolean,
  innerRef: (ref: ?HTMLElement) => void,
  label: string | MessageDescriptor,
  name: string,
  onChange: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
  open: () => void,
  toggle: () => void,
  value: string,
};

class InputField extends Component<Props> {
  inputNode: ?HTMLInputElement;

  registerInputNode = (ref: ?HTMLInputElement) => {
    const { innerRef } = this.props;
    this.inputNode = ref;
    innerRef(ref);
  };

  handleClick = () => {
    const { open } = this.props;
    open();
  };

  handleInputKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const { close, open } = this.props;
    if (e.key === TAB) {
      close();
    } else if (e.key === ESC) {
      close(null, { cancelled: true });
    } else {
      open();
    }
  };

  render() {
    const { close, open, toggle, id, isOpen, value, ...props } = this.props;
    return (
      <Input
        connect={false}
        onClick={this.handleClick}
        onFocus={this.handleClick}
        onKeyDown={this.handleInputKeyDown}
        innerRef={this.registerInputNode}
        aria-describedby={isOpen ? id : null}
        $value={value}
        {...props}
      />
    );
  }
}

export default InputField;
