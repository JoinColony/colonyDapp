/* @flow */

import { compose } from 'recompose';
import withProps from 'recompose/withProps';

import { withWizard } from '../../../core/components/Wizard';
import CreateColony from './CreateColonyWizard.jsx';
import * as StepColonyDetails from './StepColonyDetails.jsx';
import * as StepCreateNewToken from './CreateNewToken.jsx';

const steps = [StepColonyDetails, StepCreateNewToken];

const CreateColonyContainer = compose(
  withWizard({
    steps,
  }),
  withProps(() => ({ external: true })),
)(CreateColony);

export default CreateColonyContainer;
