import { ComponentType, ReactNode, SyntheticEvent, KeyboardEvent } from 'react';

export type ItemDataType<D> = D & {
  id: string;
};

export type EmptyRenderFnType = () => ReactNode;

export type ItemRenderFnType<D> = (
  itemData: ItemDataType<D>,
  selected: boolean,
) => ReactNode;

export type Choose = (event: SyntheticEvent) => void;

export type Select = (idx: number) => void;

export interface OmniPickerData {
  id: string;
}

export interface WrappedComponentProps {
  OmniPicker: ComponentType<any>;
  inputProps: {
    id: string;
    autoComplete: 'off';
    onKeyUp: (evt: KeyboardEvent<HTMLElement>) => void;
    onKeyDown: (evt: KeyboardEvent<HTMLElement>) => void;
    onFocus: (evt: SyntheticEvent<HTMLInputElement>) => void;
    onBlur: (evt: SyntheticEvent<HTMLInputElement>) => void;
    onChange: (evt: SyntheticEvent<HTMLInputElement>) => void;
    value: string;
    'aria-autocomplete': 'list';
    'aria-controls': string;
    'aria-activedescendant': string;
  };
  registerInputReactNode: (inputReactNode: HTMLInputElement | null) => void;
  OmniPickerWrapper: ComponentType<any>;
  omniPickerIsOpen: boolean;
  openOmniPicker: () => void;
}
