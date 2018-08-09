/* @flow */

import type { ComponentType } from 'react';

export type Cancel = () => void;

export type Close = (val: any) => void;

export type DialogComponent = ComponentType<{
  cancel: Cancel,
  close: Close,
}>;
