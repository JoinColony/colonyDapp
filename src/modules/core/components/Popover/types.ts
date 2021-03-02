import { ReactNode, ReactElement } from 'react';
import { MessageDescriptor } from 'react-intl';

export type PopoverAppearanceType = {
  theme?: 'dark' | 'grey';
  size?: 'medium';
};

export interface PopoverChildFnProps {
  ref: (arg0: HTMLElement | null) => void;
  id: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export type PopoverChildFn = (arg0: PopoverChildFnProps) => ReactNode;

export type PopoverTriggerElementType = PopoverChildFn | ReactElement;

export type PopoverTriggerType = 'hover' | 'click' | 'disabled';

export type PopoverContent =
  | ReactNode
  | MessageDescriptor
  | ((arg0: { close: () => void }) => ReactNode);
