import { ComponentType } from 'react';

type Cancel = () => void;

type Close = (val: any) => void;

export interface DialogProps {
  cancel: Cancel;
  close: Close;
}

export interface DialogType<P> {
  Dialog: ComponentType<P>;
  cancel: Cancel;
  close: Close;
  key: string;
  props: P | undefined;
  afterClosed: () => Promise<any>;
}
