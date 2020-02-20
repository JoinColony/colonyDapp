import { ReactNode, ReactElement } from 'react';

import { RefHandler } from 'react-popper';

export type PopoverAppearanceType = {
  theme: 'dark' | 'grey';
};

export interface PopoverChildFnProps {
  ref: RefHandler;
  id: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export type PopoverChildFn = (arg0: PopoverChildFnProps) => ReactNode;

export type PopoverTriggerElementType = PopoverChildFn | ReactElement;

export type PopoverTriggerType = 'hover' | 'click' | 'disabled';
