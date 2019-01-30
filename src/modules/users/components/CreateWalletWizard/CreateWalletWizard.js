/* @flow */

import compose from 'recompose/compose';

import withWizard from '../../../core/components/Wizard/withWizard';
import CreateWalletWizard from './CreateWalletWizard.jsx';

import StepCreatePhrase from './StepCreatePhrase.jsx';
import StepBackupPhrase from './StepBackupPhrase.jsx';
import StepProveMnemonic from './StepProveMnemonic.jsx';

const steps = [StepCreatePhrase, StepBackupPhrase, StepProveMnemonic];

const CreateWalletContainer = compose(withWizard({ steps }))(
  CreateWalletWizard,
);

export default CreateWalletContainer;
