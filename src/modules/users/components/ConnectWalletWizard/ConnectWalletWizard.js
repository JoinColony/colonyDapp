/* @flow */

import { compose } from 'recompose';

import withWizard from '~core/Wizard/withWizard';
import ConnectWalletWizard from './ConnectWalletWizard.jsx';

import * as StepStart from './StepStart';
import * as StepHardware from './StepHardware';
import * as StepMetaMask from './StepMetaMask';
import * as StepMnemonic from './StepMnemonic';
import * as StepJSONUpload from './StepJSONUpload';

const stepArray = [StepStart];

type StepValues = {
  method: 'metamask' | 'hardware' | 'mnemonic' | 'json',
};

// This is a step function to allow the wizard flow to branch
// off into two instead of just stepping through an array in a linear manner
const stepFunction = (step: number, { method }: StepValues) => {
  if (step === 1) {
    switch (method) {
      case 'hardware':
        return StepHardware;
      case 'metamask':
        return StepMetaMask;
      case 'mnemonic':
        return StepMnemonic;
      case 'json':
        return StepJSONUpload;
      default:
        break;
    }
  }
  return stepArray[step];
};

const ConnectWalletContainer = compose(
  withWizard({
    steps: stepFunction,
    stepCount: 2,
  }),
)(ConnectWalletWizard);

export default ConnectWalletContainer;
