import { ComponentType } from 'react';
import { $Values } from 'utility-types';
import compose from 'recompose/compose';

import WizardTemplate from '~pages/WizardTemplateColony';
import { StepsFn, StepType } from '~core/Wizard/withWizard';
import { withLoggedInUser } from '~data/index';

import { withWizard } from '../../../core/components/Wizard';
import StepTokenChoice from './StepTokenChoice';
import StepColonyName from './StepColonyName';
import StepSelectToken from './StepSelectToken';
import StepCreateToken from './StepCreateToken';
import StepConfirmAllInput from './StepConfirmAllInput';
import StepUserName from './StepUserName';
import StepConfirmTransactions from './StepConfirmTransactions';

const stepArray: StepType[] = [
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
    const { username } = props.loggedInUser;

    /*
     * In case the username is already registered
     * the create user name step should be skipped
     */

    /* When username hasn't been created flow through wizard is different */
    if (!username) {
      if (step === 3) {
        return pickTokenStep(tokenChoice);
      }
      return stepArray[step] as ComponentType<any>;
    }

    /* Standard wizard flow  */
    if (step === 0) {
      if (username && stepArray[0].stepName === 'StepUserName') {
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

const initialValues = (props?: any) => {
  const guaranteedStepValues = [
    {
      colonyName: '',
      displayName: '',
    },
    {
      tokenChoice: '',
    },
    {
      tokenAddress: '',
      tokenName: '',
      tokenSymbol: '',
    },
  ];
  if (props) {
    const { username } = props.loggedInUser;
    if (!username) {
      return [
        {
          username: '',
        },
        ...guaranteedStepValues,
      ];
    }
  }
  return guaranteedStepValues;
};

const CreateColonyContainer = compose(
  withLoggedInUser,
  withWizard({
    initialValues,
    steps: stepFunction,
  }),
)(WizardTemplate);

export default CreateColonyContainer;
