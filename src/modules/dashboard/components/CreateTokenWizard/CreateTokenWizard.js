/* @flow */

import { compose } from 'recompose';
import withProps from 'recompose/withProps';

import { withWizard } from '../../../core/components/Wizard';
import CreateTokenWizard from './CreateTokenWizard.jsx';
import * as CreateToken from './CreateToken.jsx';

const steps = [CreateToken];

const CreateTokenContainer = compose(
  withWizard({
    steps,
  }),
  withProps(() => ({ external: true })),
)(CreateTokenWizard);

export default CreateTokenContainer;
