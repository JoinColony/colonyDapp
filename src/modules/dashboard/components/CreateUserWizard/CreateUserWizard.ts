import compose from 'recompose/compose';
import { ComponentType } from 'react';

import { userDidClaimProfile } from '../../../users/checks';
import { withCurrentUser } from '../../../users/hocs';
import { withWizard } from '~core/Wizard';
// @ts-ignore
import CreateUser from './CreateUserWizard.tsx';
import StepUserName from './StepUserName';
import StepConfirmTransaction from './StepConfirmTransaction';

const wizardSteps = [StepUserName, StepConfirmTransaction];

const steps = (step: number, formValues: any, props: any) => {
  if (props && props.currentUser && userDidClaimProfile(props.currentUser)) {
    return StepConfirmTransaction as ComponentType<any>;
  }
  return wizardSteps[step] as ComponentType<any>;
};

const CreateUserContainer = compose(
  withCurrentUser,
  withWizard({
    steps,
  }),
)(CreateUser);

export default CreateUserContainer;
