/* @flow */

import { compose } from 'recompose';
import withProps from 'recompose/withProps';

import { withWizard } from '../../../core/components/Wizard';
import CreateColony from './CreateColonyWizard.jsx';
import * as StepColonyName from './ColonyName.jsx';
import * as StepTokenChoice from './TokenChoice.jsx';
import * as StepColonyName from './StepColonyName.jsx';
import * as StepTokenChoice from './StepTokenChoice.jsx';
import * as StepSelectToken from './StepSelectToken.jsx';
import * as StepCreateToken from './StepCreateToken.jsx';

const stepArray = [
  StepColonyName,
  StepTokenChoice,
  {
    select: StepSelectToken,
    create: StepCreateToken,
  },
];

type StepValues = {
  tokenChoice: 'create' | 'select',
};

const stepFunction = (step: number, values: StepValues) => {
  if (step === 2) {
    return stepArray[2][values.tokenChoice];
  }
  return stepArray[step];
};

const CreateColonyContainer = compose(
  withWizard({
    steps: stepFunction,
  }),
  withProps(() => ({ external: true })),
)(CreateColony);

export default CreateColonyContainer;
