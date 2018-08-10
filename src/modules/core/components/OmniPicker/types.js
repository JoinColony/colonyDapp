/* @flow */

import type { ComponentType } from 'react';

export type ItemComponentType = ComponentType<{
  itemData: any,
  selected: boolean,
}>;

export type Choose = void => void;

export type Select = (idx: number) => void;

export type Data = { id: string };

export type WrappedComponentProps = {
  OmniPicker: ComponentType<{ itemComponent: ItemComponentType }>,
  inputProps: {
    id: string,
    autoComplete: 'off',
    onKeyUp: (evt: SyntheticKeyboardEvent<HTMLElement>) => void,
    onKeyDown: (evt: SyntheticKeyboardEvent<HTMLElement>) => void,
    onFocus: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
    onBlur: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
    onChange: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
    value: string,
    'aria-autocomplete': 'list',
    'aria-controls': string,
    'aria-activedescendant': string,
  },
  registerInputNode: (inputNode: ?HTMLInputElement) => void,
  OmniPickerWrapper: ComponentType<*>,
  omniPickerIsOpen: boolean,
  openOmniPicker: () => void,
  inputNode: ?HTMLInputElement,
};
