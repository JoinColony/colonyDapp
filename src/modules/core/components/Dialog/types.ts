import { ComponentType } from 'react';

import { Colony } from '~data/index';

type Cancel = () => void;

type Close = (val?: any) => void;

export interface DialogProps {
  cancel: Cancel;
  close: Close;
  prevStep?: string;
}

export interface DialogType<P> {
  Dialog: ComponentType<P>;
  cancel: Cancel;
  close: Close;
  key: string;
  props: P | undefined;
  afterClosed: () => Promise<any>;
}

export interface ActionDialogProps {
  colony: Colony;
  isVotingExtensionEnabled: boolean;
  back?: () => void;
}
