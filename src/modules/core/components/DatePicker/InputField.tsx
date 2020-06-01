import React, {
  InputHTMLAttributes,
  KeyboardEvent,
  SyntheticEvent,
  useCallback,
} from 'react';
import { MessageDescriptor } from 'react-intl';

import { ESC, TAB } from './keyTypes';
import { InputComponentAppearance, InputComponent } from '../Fields/Input';
import { SimpleMessageValues } from '~types/index';

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  appearance?: InputComponentAppearance;
  close: (data?: any, modifiers?: { cancelled?: boolean }) => void;
  elementOnly?: boolean;
  help?: string | MessageDescriptor;
  helpValues?: SimpleMessageValues;
  id: string;
  innerRef: (ref: HTMLElement | null) => void;
  isOpen: boolean;
  label: string | MessageDescriptor;
  labelValues?: SimpleMessageValues;
  name: string;
  onChange: (evt: SyntheticEvent<HTMLInputElement>) => void;
  open: () => void;
  placeholder?: string;
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
    <InputComponent
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
