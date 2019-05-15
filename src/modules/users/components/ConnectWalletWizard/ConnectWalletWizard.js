/* @flow */

import { compose, withProps } from 'recompose';
import ledgerWallet from '@colony/purser-ledger';
import trezorWallet from '@colony/purser-trezor';

import withWizard from '~core/Wizard/withWizard';

import type { WalletMethod } from '../../types';

import ConnectWalletWizard from './ConnectWalletWizard.jsx';

import StepStart from './StepStart';
import StepHardware from './StepHardware';
import StepMetaMask from './StepMetaMask';
import StepMnemonic from './StepMnemonic';
import StepJSONUpload from './StepJSONUpload';
import StepTrufflePig from './StepTrufflePig';

const stepArray = [StepStart, StepMetaMask];

type StepValues = {
  method: WalletMethod,
};

/*
 * Retruns a new step export so we can enhance it with the different hardware
 * wallet types
 */
const enhancedHardwareStep = (
  hardwareWalletType: ledgerWallet | trezorWallet,
) => withProps({ hardwareWalletType })(StepHardware);

// This is a step function to allow the wizard flow to branch
// off into two instead of just stepping through an array in a linear manner
const stepFunction = (step: number, { method }: StepValues) => {
  if (step === 1) {
    switch (method) {
      case 'trezor':
        return enhancedHardwareStep(trezorWallet);
      case 'ledger':
        return enhancedHardwareStep(ledgerWallet);
      case 'metamask':
        return StepMetaMask;
      case 'mnemonic':
        return StepMnemonic;
      case 'json':
        return StepJSONUpload;
      case 'trufflepig':
        return StepTrufflePig;
      default:
        break;
    }
  }
  return stepArray[step];
};

const ConnectWalletContainer = compose(
  withWizard({
    steps: stepFunction,
    stepCount: 3,
  }),
)(ConnectWalletWizard);

export default ConnectWalletContainer;
