import { ComponentType } from 'react';

export type Cancel = () => void;

export type Close = (val: any) => void;

export type DialogComponent = ComponentType<{
  cancel: Cancel;
  close: Close;
  [k: string]: any;
}>;

export interface DialogType {
  Dialog: DialogComponent;
  cancel: Cancel;
  close: Close;
  key: string;
  props?: { [k: string]: any };
  afterClosed: () => Promise<any>;
}

export type OpenDialog = (
  dialogKey: string,
  props?: { [k: string]: any },
) => DialogType;
