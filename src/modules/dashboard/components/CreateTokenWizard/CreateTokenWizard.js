/* @flow */

import { compose } from 'recompose';

import { withWizard } from '../../../core/components/Wizard';
import CreateTokenWizard from './CreateTokenWizard.jsx';
import * as CreateToken from './CreateToken.jsx';

const steps = [CreateToken];

const CreateTokenContainer = compose(
  withWizard({
    steps,
  }),
)(CreateTokenWizard);

export default CreateTokenContainer;
