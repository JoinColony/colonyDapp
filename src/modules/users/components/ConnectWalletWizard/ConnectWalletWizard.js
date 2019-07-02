/* @flow */

import { compose, withProps } from 'recompose';
import ledgerWallet from '@colony/purser-ledger';
import trezorWallet from '@colony/purser-trezor';

import type { WalletSpecificType } from '~immutable';

import withWizard from '~core/Wizard/withWizard';
import ConnectWalletWizard from './ConnectWalletWizard.jsx';
import StepStart from './StepStart';
import StepHardware from './StepHardware';
import StepMetaMask from './StepMetaMask';
import StepMnemonic from './StepMnemonic';
import StepJSONUpload from './StepJSONUpload';
import StepTrufflePig from './StepTrufflePig';

import { WALLET_SPECIFICS } from '~immutable';

const stepArray = [StepStart, StepMetaMask];

type StepValues = {
  method: WalletSpecificType,
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
      case WALLET_SPECIFICS.TREZOR:
        return enhancedHardwareStep(trezorWallet);
      case WALLET_SPECIFICS.LEDGER:
        return enhancedHardwareStep(ledgerWallet);
      case WALLET_SPECIFICS.METAMASK:
        return StepMetaMask;
      case WALLET_SPECIFICS.MNEMONIC:
        return StepMnemonic;
      case WALLET_SPECIFICS.JSON:
        return StepJSONUpload;
      case WALLET_SPECIFICS.TRUFFLEPIG:
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
