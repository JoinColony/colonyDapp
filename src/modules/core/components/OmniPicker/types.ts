import {
  ComponentType,
  ReactNode,
  SyntheticEvent,
  InputHTMLAttributes,
} from 'react';

import { Props as InProps } from './withOmniPicker';

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

export interface WrappedComponentProps extends InProps {
  OmniPicker: ComponentType<any>;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  registerInputNode: (inputNode: HTMLInputElement | null) => void;
  OmniPickerWrapper: ComponentType<any>;
  omniPickerIsOpen: boolean;
  openOmniPicker: () => void;
}
