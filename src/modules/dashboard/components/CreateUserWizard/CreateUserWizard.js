/* @flow */

import compose from 'recompose/compose';

import { withWizard } from '../../../core/components/Wizard';
import CreateUser from './CreateUserWizard.jsx';

import StepUserName from './StepUserName.jsx';
import StepConfirmTransaction from './StepConfirmTransaction.jsx';

const stepArray = [StepUserName, StepConfirmTransaction];

const stepFunction = (step: number) => stepArray[step];

const CreateUserContainer = compose(
  withWizard({
    steps: stepFunction,
  }),
)(CreateUser);

export default CreateUserContainer;
