import React, {
  Component,
  InputHTMLAttributes,
  KeyboardEvent,
  SyntheticEvent,
} from 'react';
import { MessageDescriptor } from 'react-intl';

import { ExtraFieldProps } from '~core/Fields/types';

import Input, { InputComponentAppearance } from '../Fields/Input';

import { ESC, TAB } from './keyTypes';

interface Props
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'name' | 'placeholder' | 'onBlur' | 'onChange' | 'form' | 'title'
    >,
    ExtraFieldProps {
  appearance?: InputComponentAppearance;
  close: (data?: any, modifiers?: { cancelled?: boolean }) => void;
  id: string;
  innerRef: (ref: HTMLElement | null) => void;
  isOpen: boolean;
  onChange: (evt: SyntheticEvent<HTMLInputElement>) => void;
  open: () => void;
  placeholder?: string | MessageDescriptor;
  toggle: () => void;
  value: string;
}

class InputField extends Component<Props> {
  inputNode?: HTMLInputElement | null;

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
        aria-describedby={isOpen ? id : undefined}
        value={value}
        {...props}
      />
    );
  }
}

export default InputField;
