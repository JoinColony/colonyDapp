import { MessageDescriptor } from 'react-intl';
import React, { Component, SyntheticEvent, KeyboardEvent } from 'react';

import Input, { InputComponentAppearance } from '../Fields/Input';

import { ESC, TAB } from './keyTypes';

// Left intentionally unsealed (passing props)
interface Props {
  appearance?: InputComponentAppearance;
  close: (data?: any, modifiers?: { cancelled?: boolean }) => void;
  id: string;
  isOpen: boolean;
  innerRef: (ref: HTMLElement | null) => void;
  label: string | MessageDescriptor;
  name: string;
  onChange: (evt: SyntheticEvent<HTMLInputElement>) => void;
  open: () => void;
  toggle: () => void;
  value: string;
}

class InputField extends Component<Props> {
  inputNode: HTMLInputElement | null;

  registerInputNode = (ref: HTMLInputElement | null) => {
    const { innerRef } = this.props;
    this.inputNode = ref;
    innerRef(ref);
  };

  handleClick = () => {
    const { open } = this.props;
    open();
  };

  handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
