import { ComponentType } from 'react';
import { $Values } from 'utility-types';
import compose from 'recompose/compose';

import { withWizard } from '../../../core/components/Wizard';
import { StepsFn } from '~core/Wizard/withWizard';
// @ts-ignore
import CreateColony from './CreateColonyWizard.tsx';
import StepTokenChoice from './StepTokenChoice';
import StepColonyName from './StepColonyName';
import StepSelectToken from './StepSelectToken';
import StepCreateToken from './StepCreateToken';
import StepConfirmAllInput from './StepConfirmAllInput';
import StepUserName from './StepUserName';
import StepConfirmTransactions from './StepConfirmTransactions';
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

type StepValues = {
  tokenChoice: 'create' | 'select';
};

const pickTokenStep = (tokenChoice: $Values<StepValues>) => {
  if (tokenChoice === 'create') return StepCreateToken;
  if (tokenChoice === 'select') return StepSelectToken;
  return StepCreateToken;
};

/* This is a step function to allow the wizard flow to branch
 * off into two instead of just stepping through an array in a linear manner
 */
const stepFunction: StepsFn<any> = (
  step: number,
  { tokenChoice }: StepValues,
  props?: any,
): ComponentType<any> => {
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
      return stepArray[step] as ComponentType<any>;
    }

    /* Standard wizard flow  */
    if (step === 0) {
      if (usernameCreated && stepArray[0] === StepUserName) {
        stepArray.shift();
        return stepArray[step] as ComponentType<any>;
      }
    }
    if (step === 2) {
      return pickTokenStep(tokenChoice);
    }
  }
  return stepArray[step] as ComponentType<any>;
};

const CreateColonyContainer = compose(
  withCurrentUser,
  withWizard({
    steps: stepFunction,
  }),
)(CreateColony);

export default CreateColonyContainer;
