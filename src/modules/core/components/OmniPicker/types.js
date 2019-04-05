/* @flow */

import type { ComponentType, Node } from 'react';

export type ItemDataType<D> = {| id: string, ...D |};

export type EmptyRenderFnType = () => Node;

export type ItemRenderFnType<D> = (
  itemData: ItemDataType<D>,
  selected: boolean,
) => Node;

export type Choose = void => void;

export type Select = (idx: number) => void;

export type OmniPickerData = { id: string };

export type WrappedComponentProps = {
  OmniPicker: ComponentType<{ renderItem: ItemRenderFnType<*> }>,
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
};
