/* @flow */

import compose from 'recompose/compose';

import { withWizard } from '../../../core/components/Wizard';
import CreateColony from './CreateColonyWizard.jsx';

import StepTokenChoice from './StepTokenChoice.jsx';
import StepColonyENSName from './StepColonyENSName.jsx';
import StepSelectToken from './StepSelectToken.jsx';
import StepCreateToken from './StepCreateToken.jsx';
import StepConfirmAll from './StepConfirmAll.jsx';
import StepUserENSName from './StepUserENSName.jsx';
import StepCreateTransaction from './StepCreateTransaction.jsx';

const stepArray = [
  StepUserENSName,
  StepColonyENSName,
  StepTokenChoice,
  StepConfirmAll,
  StepCreateTransaction,
];

type StepValues = {
  tokenChoice: 'create' | 'select',
};

// This is a step function to allow the wizard flow to branch
// off into two instead of just stepping through an array in a linear manner
const stepFunction = (step: number, { tokenChoice }: StepValues) => {
  if (step === 3) {
    if (tokenChoice === 'create') return StepCreateToken;
    if (tokenChoice === 'select') return StepSelectToken;
  }
  return stepArray[step];
};

const CreateColonyContainer = compose(
  withWizard({
    steps: stepFunction,
    stepCount: 6,
  }),
)(CreateColony);

export default CreateColonyContainer;
