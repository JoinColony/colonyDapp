import { ReactNode } from 'react';

export type ReactRef = (arg0: HTMLElement | null) => void;

export type PopoverPlacementType = 'auto' | 'top' | 'right' | 'bottom' | 'left';

export type PopoverAppearanceType = {
  theme: 'dark' | 'grey';
  placement?: PopoverPlacementType;
};

export type PopoverTriggerType = (arg0: {
  ref: ReactRef;
  id: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}) => ReactNode;
