/* @flow */

import { compose } from 'recompose';

import withWizard from '../../../core/components/Wizard/withWizard';
import CreateWalletWizard from './CreateWalletWizard.jsx';

import * as StepCreatePhrase from './StepCreatePhrase.jsx';
import * as StepBackupPhrase from './StepBackupPhrase.jsx';
import * as StepProveMnemonic from './StepProveMnemonic.jsx';

const steps = [StepCreatePhrase, StepBackupPhrase, StepProveMnemonic];

const CreateWalletContainer = compose(withWizard({ steps }))(
  CreateWalletWizard,
);

export default CreateWalletContainer;
