/* @flow */

import { compose } from 'recompose';
import withProps from 'recompose/withProps';

import { withWizard } from '../../../core/components/Wizard';
import UseToken from './UseTokenWizard.jsx';
import * as SelectToken from './SelectToken.jsx';

const steps = [SelectToken];

const UseTokenContainer = compose(
  withWizard({
    steps,
  }),
  withProps(() => ({ external: true })),
)(UseToken);

export default UseTokenContainer;
