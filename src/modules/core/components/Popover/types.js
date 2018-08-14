/* @flow */

import type { Node } from 'react';

export type ReactRef = (?HTMLElement) => void;

export type PopoverTrigger = ({
  ref: ReactRef,
  id: string,
  open: () => void,
  close: () => void,
  toggle: () => void,
}) => Node;
