/* @flow */

import compose from 'recompose/compose';

import { withWizard } from '../../../core/components/Wizard';
import CreateUser from './CreateUserWizard.jsx';

import StepUserName from './StepUserName.jsx';
import StepConfirmTransactions from './StepConfirmTransactions.jsx';

import { withCurrentUser } from '../../../users/hocs';

const stepArray = [StepUserName, StepConfirmTransactions];

const stepFunction = (step: number) => stepArray[step];

const CreateUserContainer = compose(
  withCurrentUser,
  withWizard({
    steps: stepFunction,
  }),
)(CreateUser);

export default CreateUserContainer;
