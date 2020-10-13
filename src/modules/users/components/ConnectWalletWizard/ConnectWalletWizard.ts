import { ComponentType } from 'react';
import { WalletMethod } from '~immutable/index';
import withWizard from '~core/Wizard/withWizard';
import WizardTemplate from '~pages/WizardTemplate/WizardTemplate';
import { WalletPopoverTemplate } from './ConnectWalletPopover';
import StepStart from './StepStart';
import StepMetaMask from './StepMetaMask';
import StepMnemonic from './StepMnemonic';
import StepGanache from './StepGanache';

interface StepValues {
  method: WalletMethod;
}

// This is a step function to allow the wizard flow to branch
// off into two instead of just stepping through an array in a linear manner
const stepFunction = (step: number, { method }: StepValues) => {
  if (!step) {
    return StepStart;
  }
  switch (method) {
    case WalletMethod.MetaMask:
      return StepMetaMask;
    case WalletMethod.Mnemonic:
      return StepMnemonic;
    case WalletMethod.Ganache:
      return StepGanache;
    default:
      return StepStart;
  }
};

const ConnectWalletFactory = (
  WrapperComponent: ComponentType<any> = WizardTemplate,
  props?: any,
) =>
  withWizard({
    steps: stepFunction,
    stepCount: 3,
  })(WrapperComponent, props);

export const ConnectWalletContainer = ConnectWalletFactory(WizardTemplate);

export const ConnectWalletContent = ConnectWalletFactory(
  WalletPopoverTemplate,
  { simplified: true },
);
