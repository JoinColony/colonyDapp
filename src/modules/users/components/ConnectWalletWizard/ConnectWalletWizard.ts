import { compose, withProps } from 'recompose';
import ledgerWallet from '@colony/purser-ledger';
import trezorWallet from '@colony/purser-trezor';

import { WalletSpecificType, WALLET_SPECIFICS } from '~immutable/index';
import withWizard from '~core/Wizard/withWizard';
import WizardTemplate from '~pages/WizardTemplate/WizardTemplate';
import StepStart from './StepStart';
import StepHardware from './StepHardware';
import StepMetaMask from './StepMetaMask';
import StepMnemonic from './StepMnemonic';
import StepJSONUpload from './StepJSONUpload';
import StepTrufflePig from './StepTrufflePig';

interface StepValues {
  method: WalletSpecificType;
}

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
  if (!step) {
    return StepStart;
  }
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
      return StepStart;
  }
};

const ConnectWalletContainer = compose(
  withWizard({
    steps: stepFunction,
    stepCount: 3,
  }),
)(WizardTemplate);

export default ConnectWalletContainer;
