import { ReactNode } from 'react';

export type ReactRef = (arg0: HTMLElement | null) => void;

export type PopoverAppearanceType = {
  theme: 'dark' | 'grey';
};

export type PopoverPlacementType = 'auto' | 'top' | 'right' | 'bottom' | 'left';

export type PopoverTriggerType = (arg0: {
  ref: ReactRef;
  id: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}) => ReactNode;
