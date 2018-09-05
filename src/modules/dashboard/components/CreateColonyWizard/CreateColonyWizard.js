/* @flow */

import { compose } from 'recompose';
import withProps from 'recompose/withProps';

import { withWizard } from '../../../core/components/Wizard';
import CreateColony from './CreateColonyWizard.jsx';
import * as ColonyName from './ColonyName.jsx';
import * as TokenChoice from './TokenChoice.jsx';

const steps = [ColonyName, TokenChoice];

const CreateColonyContainer = compose(
  withWizard({
    steps,
  }),
  withProps(() => ({ external: true })),
)(CreateColony);

export default CreateColonyContainer;
