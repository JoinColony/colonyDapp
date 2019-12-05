import compose from 'recompose/compose';
import { ComponentType } from 'react';

import { withWizard } from '~core/Wizard';
import { withLoggedInUser } from '~data/helpers';

// @ts-ignore
import CreateUser from './CreateUserWizard.tsx';
import StepUserName from './StepUserName';
import StepConfirmTransaction from './StepConfirmTransaction';

const wizardSteps = [StepUserName, StepConfirmTransaction];

const steps = (step: number, formValues: any, props: any) => {
  if (props && props.currentUser && props.currentUser.username) {
    return StepConfirmTransaction as ComponentType<any>;
  }
  return wizardSteps[step] as ComponentType<any>;
};

const CreateUserContainer = compose(
  withLoggedInUser,
  withWizard({
    steps,
  }),
)(CreateUser);

export default CreateUserContainer;
