/* @flow */

import { compose } from 'recompose';

import withWizard from '../../../core/components/Wizard';
import CreateColony from './CreateColony.jsx';
import ColonyDetails, { helpText } from './ColonyDetails.jsx';

const steps = [
  { Step: ColonyDetails, sidebarChild: helpText },
];

const CreateColonyContainer = compose(withWizard({
  steps,
  form: 'create_colony',
}))(CreateColony);

export default CreateColonyContainer;
