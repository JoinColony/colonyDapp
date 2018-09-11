/* @flow */

import { compose } from 'recompose';

import withWizard from '../../../core/components/Wizard/withWizard';
import CreateWalletWizard from './CreateWalletWizard.jsx';

import * as StepCreatePhrase from './StepCreatePhrase.jsx';
import * as StepBackupPhrase from './StepBackupPhrase.jsx';
import * as StepDragAndDropMnemonic from './StepDragAndDropMnemonic.jsx';
import * as StepProfileCreate from './StepProfileCreate.jsx';

const steps = [
  StepCreatePhrase,
  StepBackupPhrase,
  StepDragAndDropMnemonic,
  StepProfileCreate,
];

const CreateWalletContainer = compose(withWizard({ steps }))(
  CreateWalletWizard,
);

export default CreateWalletContainer;
