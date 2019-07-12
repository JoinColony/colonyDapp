/* @flow */

import compose from 'recompose/compose';

import { withWizard } from '../../../core/components/Wizard';
import CreateColony from './CreateColonyWizard.jsx';

import StepTokenChoice from './StepTokenChoice.jsx';
import StepColonyName from './StepColonyName.jsx';
import StepSelectToken from './StepSelectToken.jsx';
import StepCreateToken from './StepCreateToken.jsx';
import StepConfirmAllInput from './StepConfirmAllInput.jsx';
import StepUserName from './StepUserName.jsx';
import StepConfirmTransactions from './StepConfirmTransactions.jsx';

import { userDidClaimProfile } from '../../../users/checks';

import { withCurrentUser } from '../../../users/hocs';

const stepArray = [
  StepUserName,
  StepColonyName,
  StepTokenChoice,
  StepCreateToken,
  StepConfirmAllInput,
  StepConfirmTransactions,
];

type StepValues = {|
  tokenChoice: 'create' | 'select',
|};

const pickTokenStep = (tokenChoice: $Values<StepValues>) => {
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
  if (props) {
    const usernameCreated = userDidClaimProfile(props.currentUser);
    /*
     * In case the username is already registered
     * the create user name step should be skipped
     */

    /* When username hasn't been created flow through wizard is different */
    if (!usernameCreated) {
      if (step === 3) {
        return pickTokenStep(tokenChoice);
      }
      return stepArray[step];
    }

    /* Standard wizard flow  */
    if (step === 0) {
      if (usernameCreated && stepArray[0] === StepUserName) {
        stepArray.shift();
        return stepArray[step];
      }
    }
    if (step === 2) {
      return pickTokenStep(tokenChoice);
    }
  }
  return stepArray[step];
};

const CreateColonyContainer = compose(
  withCurrentUser,
  withWizard({
    steps: stepFunction,
  }),
)(CreateColony);

export default CreateColonyContainer;
