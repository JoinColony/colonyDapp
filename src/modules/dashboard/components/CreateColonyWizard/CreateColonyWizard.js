/* @flow */

import { compose } from 'recompose';

import { withWizard } from '../../../core/components/Wizard';
import CreateColony from './CreateColonyWizard.jsx';
import * as ColonyName from './ColonyName.jsx';
import * as TokenChoice from './TokenChoice.jsx';

const steps = [ColonyName, TokenChoice];

const CreateColonyContainer = compose(
  withWizard({
    steps,
  }),
)(CreateColony);

export default CreateColonyContainer;
