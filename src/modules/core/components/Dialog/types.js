/* @flow */

import type { ComponentType } from 'react';

export type Cancel = () => void;

export type Close = (val: any) => void;

export type DialogComponent = ComponentType<{
  cancel: Cancel,
  close: Close,
}>;

export type DialogType = {
  Dialog: DialogComponent,
  cancel: Cancel,
  close: Close,
  key: string,
  props: { [string]: any },
  afterClosed: Promise<any>,
};
