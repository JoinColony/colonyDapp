import { ComponentType } from 'react';

export type Cancel = () => void;

export type Close = (val: any) => void;

export interface DialogType<P> {
  Dialog: ComponentType<P>;
  cancel: () => void;
  close: (val: any) => void;
  key: string;
  props: P | undefined;
  afterClosed: () => Promise<any>;
}
