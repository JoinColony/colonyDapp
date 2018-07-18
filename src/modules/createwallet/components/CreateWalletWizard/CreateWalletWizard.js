/* @flow */

import { compose } from 'recompose';

import withWizard from '../../../core/components/Wizard/withWizard';
import CreateWalletWizard from './CreateWalletWizard.jsx';

import * as WalletDetails from './StepWalletDetails.jsx';
// import * as CreatePhrase from './StepCreatePhrase.jsx';
// import * as BackupPhrase from './StepBackupPhrase.jsx';
// import * as DragAndDropMnemonic from './StepDragAndDropMnemonic.jsx';

const steps = [
  WalletDetails /* CreatePhrase, BackupPhrase, DragAndDropMnemonic */,
];

const CreateWalletContainer = compose(withWizard({ steps }))(
  CreateWalletWizard,
);

export default CreateWalletContainer;
