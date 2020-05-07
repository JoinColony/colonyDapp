import { ComponentType } from 'react';
// import { withProps } from 'recompose';
// import ledgerWallet from '@colony/purser-ledger';
// import trezorWallet from '@colony/purser-trezor';

import { WALLET_SPECIFICS } from '~immutable/index';
import withWizard from '~core/Wizard/withWizard';
import WizardTemplate from '~pages/WizardTemplate/WizardTemplate';
import { WalletPopoverTemplate } from './ConnectWalletPopover';
import StepStart from './StepStart';
// import StepHardware from './StepHardware';
import StepMetaMask from './StepMetaMask';
import StepMnemonic from './StepMnemonic';
import StepTrufflePig from './StepTrufflePig';

interface StepValues {
  method: WALLET_SPECIFICS;
}

/*
 * Retruns a new step export so we can enhance it with the different hardware
 * wallet types
 */
// const enhancedHardwareStep = (
//   hardwareWalletType: ledgerWallet | trezorWallet,
// ) => withProps({ hardwareWalletType })(StepHardware);

// This is a step function to allow the wizard flow to branch
// off into two instead of just stepping through an array in a linear manner
const stepFunction = (step: number, { method }: StepValues) => {
  if (!step) {
    return StepStart;
  }
  switch (method) {
    // Disabled for now
    // case WALLET_SPECIFICS.TREZOR:
    //   return enhancedHardwareStep(trezorWallet);
    // case WALLET_SPECIFICS.LEDGER:
    //   return enhancedHardwareStep(ledgerWallet);
    case WALLET_SPECIFICS.METAMASK:
      return StepMetaMask;
    case WALLET_SPECIFICS.MNEMONIC:
      return StepMnemonic;
    case WALLET_SPECIFICS.TRUFFLEPIG:
      return StepTrufflePig;
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
