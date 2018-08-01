/* @flow */

import { compose } from 'recompose';

import { withWizard } from '../../../core/components/Wizard';
import CreateColony from './CreateColonyWizard.jsx';
import * as StepColonyDetails from './StepColonyDetails.jsx';

const steps = [StepColonyDetails];

const CreateColonyContainer = compose(
  withWizard({
    steps,
  }),
)(CreateColony);

export default CreateColonyContainer;
