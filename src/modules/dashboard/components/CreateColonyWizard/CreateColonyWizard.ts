import { ComponentType } from 'react';
import compose from 'recompose/compose';

import WizardTemplate from '~pages/WizardTemplateColony';
import { StepsFn, StepType } from '~core/Wizard/withWizard';
import { withLoggedInUser } from '~data/index';

import { withWizard } from '../../../core/components/Wizard';
import StepColonyName from './StepColonyName';
import StepUserName from '../CreateUserWizard/StepUserName';
import StepConfirmUserTransaction from '../CreateUserWizard/StepConfirmTransaction';

/**
 * @NOTE Colony Creation Wizard Flow is DISABLED
 *
 * Until the gas costs die down, the create your colony wizard is being disabled, while
 * leaving the User creation flow still operational.
 * Due to this we've had to segment the steps array, and return just the user one in
 * case of a user without claimed account who also wants to create a new colony.
 *
 * This will first register a username, then redirect to the colony flow (which will be
 * skipping the create user step), which currently is disabled
 *
 * Also, this file has been severly gutten to accomodate this change, so please
 * restore it from history when this is no longer needed
 */
const stepArrayJustUserRegistration: StepType[] = [
  StepUserName,
  StepConfirmUserTransaction,
];

type StepValues = {
  tokenChoice: 'create' | 'select';
};

/* This is a step function to allow the wizard flow to branch
 * off into two instead of just stepping through an array in a linear manner
 */
const stepFunction: StepsFn<any> = (
  step: number,
  _,
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
      return stepArrayJustUserRegistration[step] as ComponentType<any>;
    }
  }
  return StepColonyName;
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
