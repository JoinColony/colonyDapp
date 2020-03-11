import compose from 'recompose/compose';
import { ComponentType } from 'react';

import { withWizard } from '~core/Wizard';
import { withLoggedInUser } from '~data/index';

// @ts-ignore
import CreateUser from './CreateUserWizard.tsx';
import StepUserName from './StepUserName';

const wizardSteps = [StepUserName];

const steps = (step: number) => wizardSteps[step] as ComponentType<any>;

const CreateUserContainer = compose(
  withLoggedInUser,
  withWizard({
    steps,
  }),
)(CreateUser);

export default CreateUserContainer;
