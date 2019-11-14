import { ReactNode } from 'react';

export type ReactRef = (arg0: HTMLElement | null) => void;

export type PopoverPlacementType =
  | 'auto'
  | 'auto-end'
  | 'auto-start'
  | 'top'
  | 'top-end'
  | 'top-start'
  | 'right'
  | 'right-end'
  | 'right-start'
  | 'bottom'
  | 'bottom-end'
  | 'bottom-start'
  | 'left'
  | 'left-end'
  | 'left-start';

export type PopoverAppearanceType = {
  theme: 'dark' | 'grey';
};

export type PopoverTriggerType = (arg0: {
  ref: ReactRef;
  id: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}) => ReactNode;
