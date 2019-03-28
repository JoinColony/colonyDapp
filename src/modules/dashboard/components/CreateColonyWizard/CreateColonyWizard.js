/* @flow */

import compose from 'recompose/compose';

import { withWizard } from '../../../core/components/Wizard';
import CreateColony from './CreateColonyWizard.jsx';

import StepTokenChoice from './StepTokenChoice.jsx';
import StepColonyENSName from './StepColonyENSName.jsx';
import StepSelectToken from './StepSelectToken.jsx';
import StepCreateToken from './StepCreateToken.jsx';
import StepConfirmAllInput from './StepConfirmAllInput.jsx';
import StepUserENSName from './StepUserENSName.jsx';
import StepConfirmTransactions from './StepConfirmTransactions.jsx';

import { userDidClaimProfile } from '~immutable/utils';

import { withCurrentUser } from '../../../users/hocs';

const stepArray = [
  StepUserENSName,
  StepColonyENSName,
  StepTokenChoice,
  StepCreateToken,
  StepConfirmAllInput,
  StepConfirmTransactions,
];

type StepValues = {
  tokenChoice: 'create' | 'select',
};

const pickTokenStep = tokenChoice => {
  if (tokenChoice === 'create') return StepCreateToken;
  if (tokenChoice === 'select') return StepSelectToken;
  return StepCreateToken;
};

/* This is a step function to allow the wizard flow to branch
 * off into two instead of just stepping through an array in a linear manner
 */
const stepFunction = (
  step: number,
  { tokenChoice }: StepValues,
  props?: Object,
) => {
  /*
   * In case the username is already registered
   * the create user name step should be skipped
   */
  if (props) {
    if (step === 0) {
      const usernameCreated = userDidClaimProfile(props.currentUser);
      if (usernameCreated) {
        stepArray.shift();
        return stepArray[step];
      }
    }
  }

  if (step === 3) {
    pickTokenStep(tokenChoice);
  }
  return stepArray[step];
};

const CreateColonyContainer = compose(
  withCurrentUser,
  withWizard({
    steps: stepFunction,
    stepCount: 6,
  }),
)(CreateColony);

export default CreateColonyContainer;
