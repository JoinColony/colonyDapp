/* @flow */

import type { Node as ReactNode } from 'react';

export type ReactRef = (?HTMLElement) => void;

export type PopoverAppearanceType = {
  theme: 'dark' | 'grey',
};

export type PopoverPlacementType = 'auto' | 'top' | 'right' | 'bottom' | 'left';

export type PopoverTriggerType = ({
  ref: ReactRef,
  id: string,
  isOpen: boolean,
  open: () => void,
  close: () => void,
  toggle: () => void,
}) => ReactNode;
