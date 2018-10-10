/* @flow */

import { compose } from 'recompose';

import withWizard from '../../../core/components/Wizard/withWizard';
import ConnectWalletWizard from './ConnectWalletWizard.jsx';

import * as StepStart from './StepStart';
import * as StepHardware from './StepHardware';
import * as StepMetaMask from './StepMetaMask';
import * as StepMnemonic from './StepMnemonic';
import * as StepJSONUpload from './StepJSONUpload';

const stepArray = [StepStart];

type StepValues = {
  method: 'metamask' | 'hardware' | 'phrase' | 'json',
};

// This is a step function to allow the wizard flow to branch
// off into two instead of just stepping through an array in a linear manner
const stepFunction = (step: number, values: StepValues) => {
  if (step === 1 && values.method === 'hardware') {
    return StepHardware;
  }
  if (step === 1 && values.method === 'metamask') {
    return StepMetaMask;
  }
  if (step === 1 && values.method === 'phrase') {
    return StepMnemonic;
  }
  if (step === 1 && values.method === 'json') {
    return StepJSONUpload;
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
