/* @flow */

import type { ComponentType } from 'react';

export type Cancel = () => void;

export type Close = (val: any) => void;

export type DialogComponent = ComponentType<{
  cancel: Cancel,
  close: Close,
  [string]: any,
}>;

export type DialogType = {
  Dialog: DialogComponent,
  cancel: Cancel,
  close: Close,
  key: string,
  props?: { [string]: any },
  afterClosed: () => Promise<any>,
};

export type OpenDialog = (
  dialogKey: string,
  props?: { [string]: any },
) => DialogType | void;
