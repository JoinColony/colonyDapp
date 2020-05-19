import React, {
  InputHTMLAttributes,
  KeyboardEvent,
  SyntheticEvent,
  useCallback,
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
    ExtraFieldProps<string> {
  appearance?: InputComponentAppearance;
  close: (data?: any, modifiers?: { cancelled?: boolean }) => void;
  id: string;
  innerRef: (ref: HTMLElement | null) => void;
  isOpen: boolean;
  onChange: (evt: SyntheticEvent<HTMLInputElement>) => void;
  open: () => void;
  placeholder?: string | MessageDescriptor;
  value: string;
}

const InputField = ({
  close,
  id,
  innerRef,
  isOpen,
  open,
  value,
  ...rest
}: Props) => {
  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === TAB) {
        e.preventDefault();
        close();
      } else if (e.key === ESC) {
        close(null, { cancelled: true });
      } else {
        open();
      }
    },
    [close, open],
  );

  return (
    <Input
      connect={false}
      onClick={open}
      onFocus={open}
      onKeyDown={handleInputKeyDown}
      innerRef={innerRef}
      aria-describedby={isOpen ? id : undefined}
      value={value}
      {...rest}
    />
  );
};

export default InputField;
