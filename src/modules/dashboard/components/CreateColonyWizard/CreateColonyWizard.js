/* @flow */

import { compose } from 'recompose';
import withProps from 'recompose/withProps';

import { withWizard } from '../../../core/components/Wizard';
import CreateColony from './CreateColonyWizard.jsx';
import * as StepColonyDetails from './StepColonyDetails.jsx';

const steps = [StepColonyDetails];

const CreateColonyContainer = compose(
  withWizard({
    steps,
  }),
  withProps(() => ({ external: true })),
)(CreateColony);

export default CreateColonyContainer;
