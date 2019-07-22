/* @flow */

import compose from 'recompose/compose';

import { userDidClaimProfile } from '../../../users/checks';
import { withCurrentUser } from '../../../users/hocs';

import { withWizard } from '~core/Wizard';

import CreateUser from './CreateUserWizard.jsx';
import StepUserName from './StepUserName.jsx';
import StepConfirmTransaction from './StepConfirmTransaction.jsx';

const wizardSteps = [StepUserName, StepConfirmTransaction];

const steps = (step: number, formValues: Object, props: *) => {
  if (props && props.currentUser && userDidClaimProfile(props.currentUser)) {
    return StepConfirmTransaction;
  }
  return wizardSteps[step];
};

const CreateUserContainer = compose(
  withCurrentUser,
  withWizard({
    steps,
  }),
)(CreateUser);

export default CreateUserContainer;
