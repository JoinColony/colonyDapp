/* @flow */

import { compose } from 'recompose';

import withWizard from '../../../core/components/Wizard/withWizard';
import ConnectWalletWizard from './ConnectWalletWizard.jsx';

import * as StepStart from './StepStart';

const steps = [
  StepStart,
];

const ConnectWalletContainer = compose(withWizard({ steps }))(
  ConnectWalletWizard,
);

export default ConnectWalletContainer;
